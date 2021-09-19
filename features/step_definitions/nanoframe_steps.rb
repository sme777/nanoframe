# require File.expand_path(File.join(File.dirname(__FILE__), "..", "support", "paths"))

When('I click on the {string} tab') do |string|
  route = string.downcase
  if route == 'homepage'
    visit('/')
  else
    visit('/' + string.downcase)
  end
  # pending # Write code here that turns the phrase above into concrete actions
end

Then('I should see {string}') do |string|
  expect(page.text).to match(string)
  # pending # Write code here that turns the phrase above into concrete actions
end
