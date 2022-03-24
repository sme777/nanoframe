class Staple
    attr_accessor :sequence, :front, :back, :type

    def initialize(front, back, start_pos, end_pos, type, buffer=0)
        @front = front
        @back = back
        @buffer = buffer
        @type = type
        if front == back
            @sequence = convert(front.sequence[start_pos...end_pos] + buffer_bp)
        else
            @sequence  = convert(front.sequence[start_pos...] + buffer_bp + back.sequence[...end_pos])
        end
    end
    def convert(edge_seq)
        sequence = ""
        seq = edge_seq.split("")
        seq.each do |base|
            sequence += Staple.complementary_bp[base.to_sym]
        end
        sequence
    end

    def buffer_bp
        bpb = ""
        @buffer.times do |i|
            bpb += Staple.complementary_bp.keys.sample.to_s
        end
        bpb
    end

    def self.complementary_bp
        {
            "A": "T",
            "T": "A",
            "G": "C",
            "C": "G"
        }
    end
end