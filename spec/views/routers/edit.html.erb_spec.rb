# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'routers/edit', type: :view do
  before(:each) do
    @router = assign(:router, Router.create!(
                                shape: 'MyString',
                                coordinates: '',
                                sequence: ''
                              ))
  end

  it 'renders the edit router form' do
    render

    assert_select 'form[action=?][method=?]', router_path(@router), 'post' do
      assert_select 'input[name=?]', 'router[shape]'

      assert_select 'input[name=?]', 'router[coordinates]'

      assert_select 'input[name=?]', 'router[sequence]'
    end
  end
end
