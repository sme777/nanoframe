require 'rails_helper'
require 'json'

RSpec.describe Nucleotide, type: :model do
    describe 'shaping nucletoide to PDB format' do
        it 'sucessfully creates a nucleotide object' do 
            nt = Nucleotide.new('A', 0, 0)
            nt.should_not be_nil
        end
    end
end