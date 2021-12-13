Feature: design and synthesize polyhedra

Scenario: find a routing for a cuboid structure
    Given I am on 'NanoBot' page
    And I select 'Cube' from the dropdown
    Then I should see "Width"
    And I should see "Height"
    And I should see "Depth"
    And I should see "Width Stripes"
    And I should see "Height Stripes"
    And I should see 'Depth Stripes'
    When I fill out 'width' with '50'
    And I fill out 'height' with '50'
    And I fill out 'depth' with '50'
    And I fill out 'width_segment' with '4'
    And I fill out 'height_segment' with '4'
    And I fill out 'depth_segment' with '4'
    Then the 'Synthesize' button should not be disabled
    And I click on 'Synthesize'
    Then I should be on 'Routing' page

# Scenario: synthesize simple nanocube in NanoBot
#     Given I am on 'NanoBot' tab
#     And I select 'Torus' as 'shape'
#     And I fill out 'radius' with '22'
#     And I fill out 'radial segment' with '8'
#     And I fill out 'tube radius' with '2'
#     And I fill out 'tubular segment' with '24'
#     And I click on 'Synthesize'
#     Then I should be on 'Synthesizer' tab
#     And I should be able to download 'oxdna' file
#     And I should be able to see '3D torus wireframe'


# Scenario: synthesize simple nanocube in NanoBot
#     Given I am on 'NanoBot' tab
#     And I select 'Octahedron' as 'shape'
#     And I choose '8064' nucleotide scaffold
#     And I upload custom 'dna sequence file'
#     And I fill out 'radius' with '22'
#     And I fill out 'detail' with '0'
#     Then I should be on 'Synthesizer' tab
#     And I should be able to download 'oxdna' file
#     And I should be able to see '3D torus wireframe'