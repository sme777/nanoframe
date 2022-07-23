class ErrorsController < ApplicationController

    def not_found
        render "404"
    end

    def unacceptable
        render "422"
    end

    def internal_error
        render "500"
    end
end