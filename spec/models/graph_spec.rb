# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Graph', type: :api do
  describe 'staple breaking hierarchy' do
    # it 'breaks even long extensions' do
    #   broken_staples = Graph.break_long_extension(178.0)
    #   expect(broken_staples).to eq([44, 45, 44, 45])
    # end

    # it 'creates edges with staples' do
    #     edges = Graph.generate_shape_edges([Vertex.new(0, 1, 0), Vertex.new(0, 1, 1), Vertex.new(0, 0, 1)], 30)
    # end

    # it 'creates adjacent edges' do
    #     v1 = Vertex.new(0, 1)
    #     v2 = Vertex.new(1, 1)
    #     v3 = Vertex.new(1, 2)
    #     v4 = Vertex.new(1, 0)
    #     v5 = Vertex.new(2, 1)

    #     e1 = Edge.new(v1, v2)
    #     e2 = Edge.new(v2, v3)
    #     e3 = Edge.new(v4, v2)
    #     e4 = Edge.new(v2, v5)

    #     e1.next = e2.object_id
    #     e2.prev = e1.object_id
    #     e3.next = e4.object_id
    #     e4.prev = e3.object_id
    #     edges = Graph.update_adjacent_edges([e1, e2, e3, e4])
    # end
    describe 'creates staples'
    before :all do
      v1 = Vertex.new(0, 1)
      v2 = Vertex.new(1, 1)
      v3 = Vertex.new(1, 2)
      v4 = Vertex.new(1, 0)
      v5 = Vertex.new(2, 1)

      v6 = Vertex.new(1, 2, -1)
      v7 = Vertex.new(2, 1, -1)
      v8 = Vertex.new(0, 1, -1)
      v9 = Vertex.new(1, 0, -1)

      @e1 = Edge.new(v1, v2)
      @e2 = Edge.new(v2, v3)
      @e3 = Edge.new(v2, v4)
      @e4 = Edge.new(v5, v2)

      @e5 = Edge.new(v3, v6)
      @e6 = Edge.new(v5, v7)
      @e7 = Edge.new(v1, v8)
      @e8 = Edge.new(v4, v9)

      @e1.next = @e2.object_id
      @e1.prev = @e7.object_id

      @e2.next = @e5.object_id
      @e2.prev = @e1.object_id

      @e3.next = @e8.object_id
      @e3.prev = @e4.object_id

      @e4.next = @e3.object_id
      @e4.prev = @e6.object_id

      @e1.adjacent_edges << @e3.object_id
      @e4.adjacent_edges << @e2.object_id
    end
    # it 'creates correct staples with no extensions' do
    #   @e1.sequence = 'A' * 30
    #   @e2.sequence = 'G' * 30
    #   @e3.sequence = 'C' * 30
    #   @e4.sequence = 'T' * 30
    #   @e5.sequence = 'C' * 30
    #   @e6.sequence = 'A' * 30
    #   @e7.sequence = 'T' * 30
    #   @e8.sequence = 'G' * 30
    #   staples = Graph.generate_staple_strands([@e1, @e2, @e3, @e4], 30, 30, [[0], [0], [0], [0]])

    #   expect(staples.first.sequence[...15]).to eq('T' * 15)
    #   expect(staples.first.sequence[16...]).to eq('G' * 15)
    #   expect(staples.second.sequence[...15]).to eq('C' * 15)
    #   expect(staples.second.sequence[17...]).to eq('G' * 15)
    #   expect(staples.third.sequence[...15]).to eq('G' * 15)
    #   expect(staples.third.sequence[17...]).to eq('C' * 15)
    #   expect(staples.fourth.sequence[...15]).to eq('A' * 15)
    #   expect(staples.fourth.sequence[16...]).to eq('C' * 15)
    # end

    # it 'creates correct staples with horizontal extensions' do
    #   @e1.sequence = 'A' * 60
    #   @e2.sequence = 'G' * 30
    #   @e3.sequence = 'C' * 30
    #   @e4.sequence = 'T' * 60
    #   @e5.sequence = 'C' * 30
    #   @e6.sequence = 'A' * 60
    #   @e7.sequence = 'T' * 60
    #   @e8.sequence = 'G' * 30
    #   staples = Graph.generate_staple_strands([@e1, @e2, @e3, @e4], 30, 30, [[30], [0], [30], [0]])

    #   expect(staples[0].sequence).to eq('T' * 30)
    #   expect(staples[1].sequence[...15]).to eq('T' * 15)
    #   expect(staples[1].sequence[16...]).to eq('G' * 15)
    #   expect(staples[2].sequence[...15]).to eq('C' * 15)
    #   expect(staples[2].sequence[17...]).to eq('G' * 15)
    #   expect(staples[3].sequence[...15]).to eq('G' * 15)
    #   expect(staples[3].sequence[17...]).to eq('C' * 15)
    #   expect(staples[4].sequence).to eq('A' * 30)
    #   expect(staples[5].sequence[...15]).to eq('A' * 15)
    #   expect(staples[5].sequence[16...]).to eq('C' * 15)
    # end

    # it 'creates correct staples with horizontal and vertical extensions' do
    #   @e1.sequence = 'A' * 60
    #   @e2.sequence = 'G' * 60
    #   @e3.sequence = 'C' * 60
    #   @e4.sequence = 'T' * 60
    #   @e5.sequence = 'C' * 60
    #   @e6.sequence = 'A' * 60
    #   @e7.sequence = 'T' * 60
    #   @e8.sequence = 'G' * 60
    #   staples = Graph.generate_staple_strands([@e1, @e2, @e3, @e4], 30, 30, [[30], [30], [30], [30]])
    #   expect(staples[0].sequence).to eq('T' * 30)
    #   expect(staples[1].sequence[...15]).to eq('T' * 15)
    #   expect(staples[1].sequence[16...]).to eq('G' * 15)
    #   expect(staples[2].sequence).to eq('C' * 30)
    #   expect(staples[3].sequence[...15]).to eq('C' * 15)
    #   expect(staples[3].sequence[17...]).to eq('G' * 15)
    #   expect(staples[4].sequence).to eq('G' * 30)
    #   expect(staples[5].sequence[...15]).to eq('G' * 15)
    #   expect(staples[5].sequence[17...]).to eq('C' * 15)
    #   expect(staples[6].sequence).to eq('A' * 30)
    #   expect(staples[7].sequence[...15]).to eq('A' * 15)
    #   expect(staples[7].sequence[16...]).to eq('C' * 15)
    # end
  end

  it 'creates a new tetrahedron routing' do
    @generator = double(Generator,
                        exterior_extensions: 0,
                        interior_extensions: 0,
                        exterior_extension_length: 0,
                        interior_extension_length: 0)
    # @generator.stub!(exterior_extensions).and_return(0)
    # @generator.stub!(interior_extensions).and_return(0)
    # @generator.stub!(exterior_extension_length).and_return(0)
    # @generator.stub!(interior_extension_length).and_return(0)
    # byebug
    @graph = Graph.new(@generator, { 'width' => '50', 'height' => '50', 'depth' => '50', 'divisions' => '4' },
                       :tetrahedron, 'A' * 7249)
  end
end
