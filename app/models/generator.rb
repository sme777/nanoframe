class Generator < ApplicationRecord
    attr_accessor :atom_count
    # attr_accessor :filename

    def scaffold(sequence, coordinates)
        @dna = []

        #byebug
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

            @dna.push(Nucleotide.new(tide, coordinates[index, index+3], index))
            index += 3
        end
    end

    # @note using tabs instead of spaces causes pdb loading issues
    def pdb
        filename = self.__id__.to_s
        file = File.open("app/assets/results/" + filename + ".pdb", "w")
        count = 1
        base_count = 1
        file.write("MODEL        1\n")
        @dna.each do |nucleotide|
            nucleotide.atoms.each do |atom|
                file.write("ATOM" + " " * (7-count.to_s.length))
                #file.write("\t")
                file.write(count.to_s)
                if atom.element.length == 4
                    file.write(" ")
                else
                    file.write("  ")
                end
                file.write(atom.element)

                if atom.element.length == 1
                    file.write(" " * 4)
                elsif atom.element.length == 2
                    file.write(" " * 3)
                else
                    file.write(" " * 2)
                end

                file.write(atom.base + " ")
                file.write("A" + " " * 3 + base_count.to_s)
                # file.write("\n")
                if atom.x.negative?
                    file.write(" " * 5)
                else
                    file.write(" " * 6)
                end
                file.write("%0.03f" % atom.x)
                if atom.y.negative?
                    file.write(" " * 2)
                else
                    file.write(" " * 3)
                end
                # file.write(sprintf("%0.03f", atom.x) + "\t")
                file.write("%0.03f" % atom.y)

                if atom.z.negative?
                    file.write(" " * 2)
                else
                    file.write(" " * 3)
                end

                file.write("%0.03f" % atom.z)
                file.write(" " * 2)
                # if atom.z.negative?
                #     file.write(" " * 2)
                # else
                #     file.write(" " * 3)
                # end
                file.write("1.00 0.00")
                file.write(" " * 11)
                file.write(atom.element.first)
                file.write("\n")
                count += 1
            end
            base_count += 1
        end
        file.write("ENDMDL")
        file.close
        filename
    end

    def oxdna

    end

    def csv

    end

    def fasta

    end

end
 