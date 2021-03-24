Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/' => 'users#index'
  post '/' => 'users#create'
  get '/signin' => 'users#sign_in' 
  get '/signout' => 'users#sign_out'
  get '/contact' => 'users#contact'
  get '/about' => 'users#about'
  get '/nanobot' => 'generators#index'
end
