#!/usr/bin/env python3
"""Rebuild the distributable without discarding the bundled PDF.js resources."""

from __future__ import annotations

import argparse
import json
import shutil
import sys
import zipfile
from pathlib import Path


def build(project: Path, template: Path | None = None, destination: Path | None = None) -> tuple[Path, Path]:
    source = project / "src"
    manifest = json.loads((source / "manifest.json").read_text(encoding="utf-8"))
    version = manifest["version"]
    directory = destination or project
    directory.mkdir(parents=True, exist_ok=True)
    package = directory / f"zoterobooksplitter{version}.xpi"
    archive = directory / f"zotero-book-splitter-{version}-source.zip"

    if template is None:
        candidates = [entry for entry in project.glob("zoterobooksplitter*.xpi") if entry != package]
        if not candidates:
            raise FileNotFoundError("A previously published XPI is required to preserve its PDF.js resources")
        template = max(candidates, key=lambda entry: entry.stat().st_mtime)
    if not template.is_file():
        raise FileNotFoundError(template)
    if template.resolve() == package.resolve():
        raise ValueError("The template and output package must be different files")

    replacements = {
        file.relative_to(source).as_posix(): file
        for file in source.rglob("*")
        if file.is_file()
    }
    with zipfile.ZipFile(template) as existing, zipfile.ZipFile(
        package, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9
    ) as output:
        for entry in existing.infolist():
            if entry.filename in replacements or entry.is_dir():
                continue
            output.writestr(entry, existing.read(entry))
        for name, file in sorted(replacements.items()):
            output.write(file, name)

    with zipfile.ZipFile(package) as output:
        names = output.namelist()
        if len(names) != len(set(names)):
            raise ValueError("The generated XPI contains duplicate archive entries")
        packaged_manifest = json.loads(output.read("manifest.json"))
        if packaged_manifest.get("version") != version:
            raise ValueError("The packaged manifest version does not match src/manifest.json")
        if "content/epub.js" not in names:
            raise ValueError("The EPUB implementation was not included in the generated XPI")
        if b"content/epub.js" not in output.read("bootstrap.js"):
            raise ValueError("The packaged bootstrap does not load the EPUB implementation")
        if output.testzip() is not None:
            raise ValueError("The generated XPI failed CRC validation")

    shutil.copyfile(package, archive)
    return package, archive


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--template", type=Path)
    parser.add_argument("--output-directory", type=Path)
    options = parser.parse_args()
    package, archive = build(options.project, options.template, options.output_directory)
    print(f"Built {package.name} ({package.stat().st_size:,} bytes)")
    print(f"Built {archive.name} ({archive.stat().st_size:,} bytes)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
