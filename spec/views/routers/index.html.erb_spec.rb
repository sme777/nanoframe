# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'routers/index', type: :view do
  before(:each) do
    assign(:routers, [
             Router.create!(
               shape: 'Shape',
               coordinates: '',
               sequence: ''
             ),
             Router.create!(
               shape: 'Shape',
               coordinates: '',
               sequence: ''
             )
           ])
  end

  it 'renders a list of routers' do
    render
    assert_select 'tr>td', text: 'Shape'.to_s, count: 2
    assert_select 'tr>td', text: ''.to_s, count: 2
    assert_select 'tr>td', text: ''.to_s, count: 2
  end
end
