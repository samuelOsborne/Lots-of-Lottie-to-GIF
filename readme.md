# Lots-of-Lottie-to-GIF

[Forked from puppeteer-lottie-cli](https://github.com/transitive-bullshit/puppeteer-lottie-cli)

> CLI for rendering **lots** of [Lottie](http://airbnb.io/lottie) animations via [Puppeteer](https://github.com/GoogleChrome/puppeteer) to **GIF**.

<p align="center">
  <img width="100%" alt="Logo" src="https://raw.githubusercontent.com/transitive-bullshit/puppeteer-lottie/master/media/logo.gif">
</p>

## Install

```bash
npm install
```

If you want to generate **GIFs**, you must also install [gifski](https://gif.ski/). On macOS, you can run:

```bash
npm install -g gifski
```

## File structure

This project was intended only to work with how I layout my animations, it was not
meant to be a generic solution, so either stick to the same file structure as more or
modify the code to work on yours.

```bash
.
├── Dog
    ├── fill
        ├── dog-fill.json
    ├── outline
        ├── dog-outline.json
├── Cat
    ├── fill
        ├── cat-fill.json
    ├── outline
        ├── cat-outline.json
```

Will become

```bash
.
├── Dog
    ├── fill
        ├── dog-fill.json
    ├── outline
        ├── dog-outline.json
    ├── gif
        ├── fill
            ├── dog-fill.gif
        ├── outline
            ├── dog-outline.gif
├── Cat
    ├── fill
        ├── cat-fill.json
    ├── outline
        ├── cat-outline.json
    ├── gif
        ├── fill
            ├── cat-fill.gif
        ├── outline
            ├── cat-outline.gif
```



## Usage

```bash
Usage: node index.js -i [options]

Options:
  -i, --input <path>     relative path to the directory containing the file structure shown above
  -w, --width <number>   optional output width
  -h, --height <number>  optional output height
  -b, --background <css-color-value>
                         optional output background color (default: "transparent")
  -q, --quiet            disable output progress
  -V, --version          output the version number
  -h, --help             output usage information

```

```bash
Examples:
  $ node index.js -i ./animations
  $ node index.js -i ./animations -h 250 -w 250 -b '#ffffff' -q true
```

## File output

All GIFs will be output with a resolution of 500x500, a white background, 50 fps and quality 100 by default.
The GIFs can be found in the gif folder, as described above


## Compatibility

All [lottie-web](https://github.com/airbnb/lottie-web) features should be fully supported by the `svg`, `canvas`, and `html` renderers.

This includes all of the animations on [lottiefiles.com](https://lottiefiles.com/)! 🔥

Also see Lottie's full list of [supported features](https://airbnb.io/lottie/#/supported-features).


## Related

-   [puppeteer-lottie](https://github.com/transitive-bullshit/puppeteer-lottie) - Library for this CLI.
-   [puppeteer](https://github.com/GoogleChrome/puppeteer) - Headless Chrome Node API.
-   [awesome-puppeteer](https://github.com/transitive-bullshit/awesome-puppeteer) - Curated list of awesome puppeteer resources.
-   [lottie](http://airbnb.io/lottie) - Render After Effects animations natively on Web, Android and iOS, and React Native.

## License

MIT © [Samuel Osborne](https://svgenius.co)
