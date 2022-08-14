# frozen_string_literal: true

Rails.application.routes.draw do
  get 'session/create'
  get 'playground/index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/' => 'users#index', as: :root
  post '/' => 'users#create'
  get '/home/:page' => 'users#index'
  get '/profile' => 'users#profile'
  get '/signin' => 'users#sign_in'
  get '/signout' => 'users#sign_out'
  get '/miscellaneous' => 'users#miscellaneous'
  get '/synthesizer' => redirect("/synthesizer/1")
  get '/playground' => 'playground#index'

  # oauth
  get 'auth/github/callback' => 'session#github'
  get 'auth/google_oauth2/callback' => 'session#google_oauth2'
  get 'auth/failure' => 'session#failure'
  get 'logout' => 'session#destroy'

  
  get '/synthesizer/new' => 'generators#new'
  post '/synthesizer/new' => 'generators#create'
  get '/synthesizer/generator' => 'generators#generator', as: 'shape_generator'
  get '/synthesizer/:page' => 'generators#synthesizer'
  get '/synthesizer/:user/:id/visualize' => 'generators#user_visualize'
  post '/synthesizer/:id/visualize' => 'generators#visualize', as: 'generate_routing'
  get '/synthesizer/:id/async_visualize' => 'generators#async_visualize', as: 'generate_async_routing'
  get '/synthesizer/:id/visualize' => 'generators#visualize'

  get '/contact/new' => 'users#get_contact'
  post '/synthesizer/:id/update_generator' => 'generators#update_generator', as: 'update_generator'
 
  get '/checkemail' => 'users#check_email', :defaults => { format: :json }
  get '/checkusername' => 'users#check_username', :defaults => { format: :json }
  get '/dna28' => 'outreach#DNA28'
  get '/404' => 'errors#not_found'
  get '/422' => 'errors#unacceptable'
  get '/500' => 'errors#internal_error'
  match '*path' => "errors#not_found", via: :all
end
