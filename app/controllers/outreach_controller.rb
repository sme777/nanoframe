class OutreachController < ApplicationController
    def DNA28
        if params[:download] == "true"
            send_file(
                "#{Rails.root.join('app/assets/files/DNA28_Poster.pdf')}",
                filename: "nanoframe_DNA28.pdf",
                type: "application/pdf"
              )
        end
    end
end