require 'rails_helper'

RSpec.describe "routers/show", type: :view do
  before(:each) do
    @router = assign(:router, Router.create!(
      shape: "Shape",
      coordinates: "",
      sequence: ""
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Shape/)
    expect(rendered).to match(//)
    expect(rendered).to match(//)
  end
end
