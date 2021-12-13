Feature: correctly navigate between navbar tabs

Background: User is not Logged In
    When I navigate to the 'Home' page
    And I do not submit username and password
    Then I should not be logged in

Scenario: navigate to the NanoBot page
    When I navigate to the 'NanoBot' page
    Then I should see 'Select Shape' 
    And I should see '8064 nucleotides scaffold'
    And I should see '7249 nucleotides scaffold'
    And I should see 'Random Sequence'

Scenario: navigate to the Home page
    Given I am not authenticated
    When I navigate to the 'Home' page
    Then I should see 'Log In'
    And I should see 'Sign in with Google'
    And I should see 'Sign in with Facebook'
    And I should see 'Sign Up'
    And I should see 'Forgot Password?'

Scenario: navigate to the Miscellaneous page
    When I navigate to the 'Miscellaneous' page
    Then I should see 'Tutorials'
    And I should see 'API'
    And I should see 'Methods'
    And I should see 'Results'
    And I should see 'Contributing'