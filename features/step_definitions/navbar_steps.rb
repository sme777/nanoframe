# frozen_string_literal: true
When /I navigate to the '(.*)' page/ do |tab|
  route = tab.downcase
  if route == 'home'
    visit('/')
  else
    visit(route)
  end
end

When /I do (not?) submit username and password/ do |auth|
  if auth
    @user = nil
  else

  end
end

Then /I should (not?) be logged in/ do |auth|
  expect(@user).to be(nil)
end

Given /^I am (not?) authenticated$/ do |auth|
  if auth 
    expect(@user).to be(nil)
  else
    expect(@user).not_to be(nil)
  end
end

Then('I should see {string}') do |string|
  expect(page.text).to match(string)
end
