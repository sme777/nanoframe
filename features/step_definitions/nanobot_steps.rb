Given /I am on '(.*)' page/ do |route|
    step "When I navigate to the '#{route}' page"
end

When /I select '(.*)' from the dropdown/ do |elm|
    select("Cube", from: "synthesizer-shape")
end

When /I fill out '(.*)' with '(.*)'/ do |field, val|
    fill_in "generator_#{field}", with: val
end

When /I click on '(.*)'/ do |btn|
    click_button "synthesize-btn"
end

Then /the '(.*)' button should (not?) be disabled/ do |btn, disabled|
    # byebug
    if disabled
        expect(find_by_id("#{btn.downcase}-btn")).not_to be_disabled
    else
        expect(find_by_id("#{btn.downcase}-btn")).to be_disabled
    end
end


Then /I should be on '(.*)' page/ do |route|
    step "When I navigate to the 'nanobot/1/#{route.downcase}' page"
end