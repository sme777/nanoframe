# NanoFrame

[![build](https://github.com/sme777/nanoframe/actions/workflows/build.yml/badge.svg)](https://github.com/tilabberkeley/nanoframe/actions/workflows/ci.yml) [![Documentation Status](https://readthedocs.org/projects/nanoframe/badge/?version=latest)](https://nanoframe.readthedocs.io/en/latest/?badge=latest)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a7c3b1796ed55dff5f27/test_coverage)](https://codeclimate.com/github/tilabberkeley/nanoframe/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/a7c3b1796ed55dff5f27/maintainability)](https://codeclimate.com/github/tilabberkeley/nanoframe/maintainability)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

NanoFrame [nanoframe.org](https://www.nanoframe.org) is a web based tool for designing and synthesizing 3D wireframe polyhedra. NanoFrame's [synthesizer](https://www.nanoframe.org/synthesizer) generates polyhedra from single-origami scaffold of any length, which then can be used as building block for designing larger multi-origami structure in NanoFrame's [playground](https://www.nanoframe.org/playground). Save your work to the cloud by creating account at [nanoframe.org](https://www.nanoframe.org).

Consider citing the associated paper if you find the project useful.

> <ins>NanoFrame: A web-based DNA wireframe design tool for 3D structures</ins>.  
> Samson Petrosyan, Grigory Tikhomirov  
> [paper](https://google.com) | [arXiv](https://arxiv.org/abs/2111.13992)

# Contents
- [Control Flow](#control-flow)
- [Home](#home)
- [Synthesizer](#synthesizer)
- [Playground](#playground)
- [Guides](#guides)
- [Experiments](#experiments)
- [Suggestions and Reporting Issues](#suggestions-and-reporting-issues)
- [Working Locally](#working-locally)
- [Contributing](#contributing)

# Control Flow

The application is broken down into three parts, each can be navigated to with the ribbon at the top of the page.

<p align="center">
  <img src="https://github.com/sme777/nanoframe/blob/master/docs/navbar.png">
</p>

The entry point of [nanoframe.org](https://www.nanoframe.org) is the <ins>Home</ins> tab, where users are taken to a sign in/up page or their profile homepage (depending on cookie sessions); see [Home](#home) for more info.

Any user -- whether signed-in or not -- can synthesize polyhedra, the difference lies in saving the work to the cloud. Navigating to <ins>Synthesizer</ins> tab will yield the active feed of [nanoframe.org](https://www.nanoframe.org) which consist of synthesized shapes by users that were made public. In <ins>Synthesizer</ins> tab users can then click <ins>New</ins> and provide the specification of the shape.

In playground tab, user would work with an active canvas and build shapes by dragging and dropping elements on it. Both a graphical user interface (GUI) and a scriptable interface exist for ease of use. As in synthesizer tab, uers will need to be registered to save work from playground, otherwise the service is open to all users.

The guides folder has documentation on all aspects of [nanoframe.org](https://www.nanoframe.org), including vidoe tutorials (linked in this file as well), file format description, methods and materials, and API docs.

#### Home

NanoFrame allows users to sign up and save their work. Generated work can be saved as both private and public, further, once users login they can discover what other creators have been synthesizing with NanoFrame.

#### Synthesizer

The NanoBot tab is where all the magic happens. Users can select one of the predefined shapes, or create their own (upcoming feature). After selecting a shape, users can interact with the shape dynamically by adjusting its attributes.

#### Playground

NanoFrame relies on several API which were developed on par with the project. These are completely free, but to make API calls clients need to register and obtain an API key.

##### Guides

We define three types of staples: **refl**ection, **refr**action, and **ext**e**n**sion. Reflection strands connect two orthogonal parts of the scaffold and therefore connect to two non-sequential edges. Refractions can be thought of as projection onto another plane, meaning they are the staples that cross from one plane onto the other. These connect two sequential edges. Extension are staples that live in between the area leftover by reflactions and refractions. Extension staples attach to a single edge. We set up a linear program that yields the optimal choice of reflection, refraction and extension staple strands. The constraints are shown below:

```javascript
max 4sx + 2ys^2 + 2sz_1 + 2sz_2 + s(s-1)z_3 + s(s-1)z_4
s.t. x, y, z_1, z_2, z_3, z_4

x, y, z_1, z_2, z_3, z_4 >= 20
x, y <= 60
x/2 + y/2 + z_1 = w
x/2 + y/2 + z_2 = h
y + z_5 = w
y + z_6 = h
4sx + 2ys^2 + 2sz_1 + 2sz_2 + s(s-1)z_3 + s(s-1)z_4 < d
```

Here, `x` and `y` are the refraction and reflation strands, while `z_1`, `z_2`, `z_3`, `z_4` are the different types of extension strands. w and h are the width and height segments while s and d are the number of stripes and length of scaffold accordingly.

The results will be given in a csv format where the first column will be the description of the staple with row and column positions and the id number in that position of the grid. For example the first reflection strand in row 3 and column 4 on side 1 will be named `Refl-S1-R3-C4-1`. The sides are numbered as follows:

```javascript
front = 0;
back = 1;
top = 2;
bottom = 3;
left = 4;
right = 5;
```

The second column will be the sequence of the staple strands. An example file is shown below:

```csv
Refl-S1-R5-C5-1 , TCATCTTAACTACGGACGTTCGGAGTCGCTG
Refl-S1-R5-C4-1 , CGGGGTTTACTTTTAGTATACTCCCAAGATT
Refl-S1-R4-C4-1 , TAACTGGTAAACGCTGAGGCTACGACAGAAA
Refl-S1-R3-C3-1 , GTTTGATTTAGATGAGTTATAGGCCAAGAAC
Refl-S1-R4-C3-1 , CTTAGTTGACAATATGATGTGTAATGAGTCC
Refl-S1-R4-C2-1 , TCTGTGGCATGAAATTGAGCAGTCCCGTTCG
Refr-S1-R5-C2 , GTACAACTCGATGTCAAGTAATATAAGTCGTT
Refl-S4-R5-C2-1 , AATTCGAGATTCGGTTTCACGAGGATTTCTA
...
```

##### DNA File Converter

To convert provided scaffold and staples to one of DNA file formats, we provide a NanoFrame native API, which will take in a scaffold and staples file in the following `json` format.

```javascript
{
  sets: [
    // start plane 1
    {
      edges: [
        {
          v1: {
            x: 0,
            y: 0,
            z: 0,
          },
          v2: {
            x: 0,
            y: 15,
            z: 0,
          },
        },
        {
          v1: {
            x: 0,
            y: 15,
            z: 0,
          },
          v2: {
            x: 15,
            y: 15,
            z: 0,
          },
        },
      ],
    },
    {
      edges: [
        {
          v1: {
            x: -15,
            y: 15,
            z: 0,
          },
          v2: {
            x: 0,
            y: 15,
            z: 0,
          },
        },
        {
          v1: {
            x: 0,
            y: 15,
            z: 0,
          },
          v2: {
            x: 0,
            y: 30,
            z: 0,
          },
        },
      ],
    },
    // end plane 1
    /* start plane 2
      ...
        end plane 2 */
  ];
}
```

You will still need to make an API key, but this API key can be used for any of the services provided by NanoFrame. See [nanoframe.org/api](http://nanoframe.org/api) for detailed docs of APIs.

In addition, NanoFrame itself relies on a DNA file converter delivered by [popDNA](https://github.com/tilabberkeley/popDNA). Currently supported file formats are `pdb`, `oxdna`, and `json` (cadnano). The web API is provided for small file formats (< 100Mbs), for larger files please install `popDNA` with one of the [package managers](https://github.com/tilabberkeley/popDNA#installation). For extensive API documentation visit [popDNA.io/api](https://popdna.io/api).

# Synthesizer

# Playground

# Guides

# Methods

# Experiments

# Shape Picker

In **Nanobot** tab the user gets to choose a shape from given selection or make their own through _custom shape_ to syntheszie a DNA object. We provide interactive display such that the user can have an approximate idea of what the final object will look like. In following pages, more detail is added until the most granual `oxdna` or `pdb` version is generated. Currently only cuboids are supported, but there is active work in regards to other general shapes. Nanobot will give a warning if the selected shape has greater than 200 leftover base pairs and will propt the user to either continue with the current design or check out dimension generator page.

<p align="center">
  <img src="https://github.com/tilabberkeley/nanoframe/blob/master/docs/shape-maker.gif">
</p>

# Atomic Synthesization

One of the features of NanoFrame is the level fine grain detail. After selecting and editing DNA routing, atomic level visualization is made available either through Mol\* which uses the default `pdb` format, or through [oxView](https://sulcgroup.github.io/oxdna-viewer/) which uses the `oxview` file format. Both of these tool are embedded in the webpage and user can shift through each seemlessly.

To generate `pdb` files we start off by taking the positions generate through routing. As each nucleotide has a different `pdb` structure we make a map of relative positions of atoms (compared to some base atom) for each of the base bairs. The algorithm, then, starts going through each of the nucleotides in the scaffold adding atoms as neccessary and then applying some twist corresponding to DNA helix structure. For `oxview`, we just take the positions generated through routing as the center mass of the nucleobase.

<p align="center">
  <img src="https://github.com/tilabberkeley/nanoframe/blob/master/docs/cube.png">
</p>

Once the `pdb` and `oxview` files are generated, the transformation to other formats can be acheived by tools like [tacoxDNA](http://tacoxdna.sissa.it/) or [popDNA](https://github.com/tilabberkeley/popDNA.git) which is tool being developed by the authors of this project. With popDNA, it would be possible to make API calls directly instead of relying on selenium driver for fetching files generated by tacoxDNA.

# Saving Work

All NanoFrame's features are available to any user, but only authenticated users can save their work. Authentication can be done either through signing up with NanoFrame and claiming a username, or through Google/Facebook authentication. Other third-party authentications will be added on demand. In addition, users can also view work of peers that are made public. This will be a feed type of page where users can view, share, and comment on designs generated by others. We also provide the option of saving work in private mode (that is - not visible to anyone but creator).

# Suggestions and Reporting Issues

To suggestion or reporting issues in NanoFrame, simply go to [Issues](https://github.com/tilabberkeley/nanoframe/issues) and click on **New Issue**. Provide a title and description. Please write as much detail in description as possible, including the browser and it's version. While NanoFrame is architecture independent, often broswers lag behind in JavaScript and WebGL updates, so simply changing the broswer may resolve the issue. Regardless, still open an issue so the authors are aware of possible bugs.

# Working Locally

Working locally can speed up the process of certain queries. To get started clone this repo to your workspace. You will need to have ruby insatlled for running the next commands. [chruby](https://github.com/postmodern/chruby), [rvm](https://rvm.io/), and [rbenv](https://github.com/rbenv/rbenv) are all great ruby package managers. You will need to have `ruby 3.0.3` to run the app locally. Once you have installed ruby successfully, run `bundle install` in NanoFrame's root directory to install all project dependencies (this might take some time). Then, run `rails s` to boot up the server. Now, navigate to `http://localhost:3000` in your broswer and you should see NanoFrame get activated. Note, that none of you work on production mode (i.e. [nanoframe.org](http://nanoframe.org)) will be avaiable, however you can download the files from the website and upload locally through your homepage.

# Contributions

If you would like to contribute to this project, please <ins>fork</ins> this repository first and make a <ins>pull request</ins> with the branch name of the feature you would like to add. Be sure to check out the [contributions page](https://github.com/tilabberkeley/nanoframe/CONTRIBUTING.md) for further details. We made this project open-source so builders like you can help us provide best quality software to scientists interested in work with DNA nanotechnology. Thank YOU for taking the time to read this far!
