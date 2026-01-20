# wmc-downloader

A downloader for [Wikimedia Commons images](https://commons.wikimedia.org/wiki/Main_Page). The download not only includes the image file but also metadata in the form of an XML-file.

Only downloading of image assets has been tested.

## Run

```bash
wmc-downloader <filename>
```

## Development

This application uses Bun.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Note

The download relies on an API on https://magnus-toolserver.toolforge.org which
is marked `experimental`.

## License

MIT License
