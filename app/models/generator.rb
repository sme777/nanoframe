class Generator < ApplicationRecord
    attr_accessor :atom_count

    def scaffold(sequence, coordinates)
        @dna = []
        @atom_count = 0
        index = 0
        sequence.each do |tide|

            if tide == "A"
                @atom_count += 32
            elsif tide == "T"
                @atom_count += 32
            elsif tide == "G"
                @atom_count += 33
            else
                @atom_count += 30
            end

            @dna.push(Nucleotide.new(tide, coordinates[index], index))
            index += 1
        end
    end

    def pdb
        file = File.open("app/assets/results/" + self.__id__.to_s + ".pdb", "w")
        count = 1
        file.write("MODEL\t\t1")
        @dna.each do |nucleotide|
            nucleotide.atoms.each do |atom|
                file.write("ATOM")
                file.write("\t")
                file.write(count.to_s + "\t")
                file.write(atom.element + "\t\t")
                file.write(atom.base + "\t")
                file.write("A\t1\t")
                # file.write("\n")
                # file.write(atom.x + " ")
                # file.write(atom.y + " ")
                # file.write(atom.z + " ")
                file.write("1.00 0.00")
                file.write("\t\t")
                file.write(atom.element.first)
                file.write("\n")
                count += 1
            end
        end
        file.write("ENDMDL")
        file.close

    end
end
 