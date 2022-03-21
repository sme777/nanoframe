# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Ruby CBC', type: :api do
  describe 'solving linear program' do
    it 'solves for 50x50x50x4 cube' do
        
        m = Cbc::Model.new
        s = 5
        s2 = s**2
        w = 30
        h = 30
        d = 7249
        x, y, z1, z2, z3, z4 = m.int_var_array(6, 0..Cbc::INF)
        m.maximize(16*x + 32*y + 8*z1 + 8*z2 + 12*z3 + 12*z4)

        m.enforce(x >= 20)
        m.enforce(y >= 20)
        # z constraints obtained in preprocessing
        m.enforce(z1 >= 0)
        m.enforce(z1 <= 0)
        m.enforce(z2 >= 0)
        m.enforce(z2 <= 0)
        m.enforce(z3 >= 0)
        m.enforce(z3 <= 0)
        m.enforce(z4 >= 0)
        m.enforce(z4 <= 0)

        m.enforce(x <= 60)
        m.enforce(y <= 60)

        m.enforce(0.5 * x + 0.5 * y + z1 >= w)
        m.enforce(0.5 * x + 0.5 * y + z2 >= h)
        m.enforce(0.5 * x + 0.5 * y + z1 <= w)
        m.enforce(0.5 * x + 0.5 * y + z2 <= h)
        
        m.enforce(x + z3 >= w)
        m.enforce(y + z4 >= h)
        m.enforce(x + z3 <= w)
        m.enforce(y + z4 <= h)

        m.enforce(4*s*x + 2*s2*y + 2*s*z1 + 2*s*z2 + (s2-s)*z3 + (s2-s)*z4 <= d)

        p = m.to_problem
        p.solve
        
        expect(p.value_of(x)).to eq(30)
        expect(p.value_of(y)).to eq(30)
        expect(p.value_of(z1)).to eq(0)
        expect(p.value_of(z2)).to eq(0)
        expect(p.value_of(z3)).to eq(0)
        expect(p.value_of(z4)).to eq(0)
    end


    it 'solves for 40x40x120x3 cube 40x40 side' do
        m = Cbc::Model.new
        s = 4
        s2 = s**2
        w = 30
        h = 30
        d = 7249
        x, y, z1, z2, z3, z4 = m.int_var_array(6, 0..Cbc::INF)
        m.maximize(2*s2*x + 4*s*y + 2*s*z1 + 2*s*z2 + (s2-s)*z3 + (s2-s)*z4)

        m.enforce(x >= 20)
        m.enforce(y >= 20)
        # z constraints obtained in preprocessing
        m.enforce(z1 >= 0)
        m.enforce(z1 <= 0)
        m.enforce(z2 >= 0)
        m.enforce(z2 <= 0)
        m.enforce(z3 >= 0)
        m.enforce(z3 <= 0)
        m.enforce(z4 >= 0)
        m.enforce(z4 <= 0)

        m.enforce(x <= 60)
        m.enforce(y <= 60)

        m.enforce(0.5 * x + 0.5 * y + z1 >= w)
        m.enforce(0.5 * x + 0.5 * y + z2 >= h)
        m.enforce(0.5 * x + 0.5 * y + z1 <= w)
        m.enforce(0.5 * x + 0.5 * y + z2 <= h)
        
        m.enforce(x + z3 >= w)
        m.enforce(y + z4 >= h)
        m.enforce(x + z3 <= w)
        m.enforce(y + z4 <= h)

        m.enforce(2*s2*x + 4*s*y + 2*s*z1 + 2*s*z2 + (s2-s)*z3 + (s2-s)*z4 <= d)

        p = m.to_problem
        p.solve
        
        expect(p.value_of(x)).to eq(30)
        expect(p.value_of(y)).to eq(30)
        expect(p.value_of(z1)).to eq(0)
        expect(p.value_of(z2)).to eq(0)
        expect(p.value_of(z3)).to eq(0)
        expect(p.value_of(z4)).to eq(0)
    end

    it 'solves for 40x40x120x3 cube 40x120 side' do
        m = Cbc::Model.new
        s = 4
        s2 = s**2
        w = 90
        h = 30
        d = 7249
        x, y, z1, z2, z3, z4 = m.int_var_array(6, 0..Cbc::INF)
        m.maximize(2*s2*x + 4*s*y + 2*s*z1 + 2*s*z2 + (s2-s)*z3 + (s2-s)*z4)

        m.enforce(x >= 20)
        m.enforce(y >= 20)
        # z constraints obtained in preprocessing
        m.enforce(z2 >= 0)
        m.enforce(z2 <= 0)
        m.enforce(z4 >= 0)
        m.enforce(z4 <= 0)

        m.enforce(x <= 60)
        m.enforce(y <= 60)

        m.enforce(0.5 * x + 0.5 * y + z1 >= w)
        m.enforce(0.5 * x + 0.5 * y + z2 >= h)
        m.enforce(0.5 * x + 0.5 * y + z1 <= w)
        m.enforce(0.5 * x + 0.5 * y + z2 <= h)
        
        m.enforce(x + z3 >= w)
        m.enforce(y + z4 >= h)
        m.enforce(x + z3 <= w)
        m.enforce(y + z4 <= h)

        m.enforce(2*s2*x + 4*s*y + 2*s*z1 + 2*s*z2 + (s2-s)*z3 + (s2-s)*z4 <= d)

        p = m.to_problem
        p.solve
        expect(p.value_of(x)).to eq(30)
        expect(p.value_of(y)).to eq(30)
        expect(p.value_of(z1)).to eq(60)
        expect(p.value_of(z2)).to eq(0)
        expect(p.value_of(z3)).to eq(60)
        expect(p.value_of(z4)).to eq(0)
    end
  end
end
