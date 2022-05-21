# NanoFrame

[![build](https://github.com/tilabberkeley/nanoframe/actions/workflows/build.yml/badge.svg)](https://github.com/tilabberkeley/nanoframe/actions/workflows/ci.yml) [![Documentation Status](https://readthedocs.org/projects/nanoframe/badge/?version=latest)](https://nanoframe.readthedocs.io/en/latest/?badge=latest)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a7c3b1796ed55dff5f27/test_coverage)](https://codeclimate.com/github/tilabberkeley/nanoframe/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/a7c3b1796ed55dff5f27/maintainability)](https://codeclimate.com/github/tilabberkeley/nanoframe/maintainability)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

NanoFrame [nanoframe.org](https://nanoframe.org) is a web based tool which enables design and synthesis of 3D wireframe objects. This web application takes a single stranded DNA scaffold (either 7249 or 8064-base) with custom sequences and forms the desired wireframe shape in 3D.
Supported wireframes include cube, sphere, cone, tetrahedron, and many more.

Consider citing the associated paper if you find the project useful.

> <ins>NanoFrame: A web-based DNA wireframe design tool for 3D structures</ins>.  
> Samson Petrosyan, Grigory Tikhomirov  
> [paper](https://google.com) | [arXiv](https://arxiv.org/abs/2111.13992)

# Contents

- [Control Flow](#control-flow)
- [**Video Tutorials**](https://www.youtube.com/playlist?list=PLJfZub7t7u3IMP3gVfIM1P1G8e6bqCVK2)
- [Shape Picker](#shape-picker)
- [DNA Routing](#dna-routing)
- [Atomic Synthesization](#atomic-synthesization)
- [Saving Work](#saving-work)
- [Suggestions and Reporting Issues](#suggestions-and-reporting-issues)
- [Working Locally](#working-locally)
- [Contributions](#contributions)

# Control Flow

The application is broken down into three parts, each can be navigated to with the ribbon at the top of the page.

#### Home

NanoFrame allows users to sign up and save their work. Generated work can be saved as both private and public, further, once users login they can discover what other creators have been synthesizing with NanoFrame.

#### The NanoBot

The NanoBot tab is where all the magic happens. Users can select one of the predefined shapes, or create their own (upcoming feature). After selecting a shape, users can interact with the shape dynamically by adjusting its attributes.

#### Miscellaneous

NanoFrame relies on several API which were developed on par with the project. These are completely free, but to make API calls clients need to register and obtain an API key.

##### Automatic Staple Generation

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

# Video Tutorials

A list of video tutorial on how to use each tool of NanoFrame could be found here.

- Shape Picker: https://youtube.com/playlist?list=PLJfZub7t7u3IMP3gVfIM1P1G8e6bqCVK2
- Dimension Generator: https://youtube.com/playlist?list=PLJfZub7t7u3IMP3gVfIM1P1G8e6bqCVK2
- DNA Routing: https://youtube.com/playlist?list=PLJfZub7t7u3IMP3gVfIM1P1G8e6bqCVK2
- Synthesization: https://youtube.com/playlist?list=PLJfZub7t7u3IMP3gVfIM1P1G8e6bqCVK2
- Saving work: https://youtube.com/playlist?list=PLJfZub7t7u3IMP3gVfIM1P1G8e6bqCVK2
- APIs: https://youtube.com/playlist?list=PLJfZub7t7u3IMP3gVfIM1P1G8e6bqCVK2

# Shape Picker

In **Nanobot** tab the user gets to choose a shape from given selection or make their own through _custom shape_ to syntheszie a DNA object. We provide interactive display such that the user can have an approximate idea of what the final object will look like. In following pages, more detail is added until the most granual `oxdna` or `pdb` version is generated. Currently only cuboids are supported, but there is active work in regards to other general shapes. Nanobot will give a warning if the selected shape has greater than 200 leftover base pairs and will propt the user to either continue with the current design or check out dimension generator page.

<p align="center">
  <img src="https://github.com/tilabberkeley/nanoframe/blob/master/docs/shape-maker.gif">
</p>

# Dimension Generator

We provide a tool for fidning the desired shape with minimum leftover base pairs [nanoframe.org/nanobot/generator](https://nanoframe.org/nanobot/generator). One can specifiy the granuality of the output by provindng the step size. A benchmark loopout length can also be set, such that shapes with loopout length greater than the threshold will be discarded. Optionally, we provide max and min dimension as well as the length of the scaffold which by default is M13mp18 bacteriophage DNA.

# DNA Routing

Once an initial design has been chose, the next step is to run the routing algorithm. The routing for cuboids is found by identifying 4 unique routings for a single plane, and then taking product of these planes to generate all possible choice combination (4096). Then each of these is checked to have a single loop (corresponding to the scaffold) and when one is found it's returned as the routing solution. For large number of stripes, the routing are not unique, and can be regnerated as shown in the illustration below.

For finding plane routing we model the plane as a graph and use randomized depth first search to find a routing. The current algorithms in place are not complexity efficient and can be vastly optimized. The prerelease rather serves as a proof-of-concept. The algorithm slow down when the number of stripes exceeds 7. In future work, these methods will be optimized to yield higher space and time complexities and generate shapes with much larger number of sripes in short period of time.

### 3D View and Regeneration

<p align="center">
  <img src="https://github.com/tilabberkeley/nanoframe/blob/master/docs/shape_routing.gif">
</p>

### Manual Editing

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

Working locally can speed up the process of certain queries. To get started clone this repo to your workspace. You will need to have ruby insatlled for running the next commands. [chruby](https://github.com/postmodern/chruby), [rvm](https://rvm.io/), and [rbenv](https://github.com/rbenv/rbenv) are all great ruby package managers. You will need to have `ruby 2.7.2` to run the app locally. Once you have installed ruby successfully, run `bundle install` in NanoFrame's root directory to install all project dependencies (this might take some time). Then, run `rails s` to boot up the server. Now, navigate to `http://localhost:3000` in your broswer and you should see NanoFrame get activated. Note, that none of you work on production mode (i.e. [nanoframe.org](http://nanoframe.org)) will be avaiable, however you can download the files from the website and upload locally through your homepage.

# Contributions

If you would like to contribute to this project, please <ins>fork</ins> this repository first and make a <ins>pull request</ins> with the branch name of the feature you would like to add. Be sure to check out the [contributions page](https://github.com/tilabberkeley/nanoframe/CONTRIBUTING.md) for further details. We made this project open-source so builders like you can help us provide best quality software to scientists interested in work with DNA nanotechnology. Thank YOU for taking the time to read this far!
