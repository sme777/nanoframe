# frozen_string_literal: true

class PlaygroundController < ApplicationController
  def index
    @playground_items = PlaygroundItem.all
  end
end
