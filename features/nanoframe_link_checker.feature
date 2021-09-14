Feature: display synthesization page

    As a DNA nanotech ethusiast 
    So that I can synthesize a wireframe design

Scenario: navigate to NanoBot window with fresh session
    When I click on the 'NanoBot' tab
    Then I should see 'Select Shape' 

Scenario: synthesize simple nanocube in NanoBot
    Given I am on 'NanoBot' tab
    And I select 'Cube' as 'shape'
    And I fill out 'width' with '30'
    And I fill out 'height' with '30'
    And I fill out 'depth' with '30'
    And I fill out 'width segment' with '30'
    And I fill out 'height segment' with '30'
    And I fill out 'depth segment' with '30'
    And I click on 'Synthesize'
    Then I should be on 'Synthesizer' tab
    And I should be able to download 'pdb' file
    And I should be able to see '3D cube wireframe'


Scenario: synthesize simple nanocube in NanoBot
    Given I am on 'NanoBot' tab
    And I select 'Torus' as 'shape'
    And I fill out 'radius' with '22'
    And I fill out 'radial segment' with '8'
    And I fill out 'tube radius' with '2'
    And I fill out 'tubular segment' with '24'
    And I click on 'Synthesize'
    Then I should be on 'Synthesizer' tab
    And I should be able to download 'oxdna' file
    And I should be able to see '3D torus wireframe'


Scenario: synthesize simple nanocube in NanoBot
    Given I am on 'NanoBot' tab
    And I select 'Octahedron' as 'shape'
    And I choose '8064' nucleotide scaffold
    And I upload custom 'dna sequence file'
    And I fill out 'radius' with '22'
    And I fill out 'detail' with '0'
    Then I should be on 'Synthesizer' tab
    And I should be able to download 'oxdna' file
    And I should be able to see '3D torus wireframe'

Scenario: navigate to Homepage
    When I click on the 'Homepage' tab
    Then I should see 'Sign Up'
    And I should see 'Log In'