# frozen_string_literal: true

Rails.application.routes.draw do
  get 'session/create'
  get 'playground/index'
  resources :routers
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/' => 'users#index', as: :root
  post '/' => 'users#create'
  get '/home/:page' => 'users#index', as: :root_pagination
  get '/profile' => 'users#profile'
  get '/signin' => 'users#sign_in'
  get '/signout' => 'users#sign_out'
  get '/miscellaneous' => 'users#miscellaneous'
  get '/nanobot' => 'generators#index'
  get '/playground' => 'playground#index'
  post '/nanobot' => 'generators#create', as: 'generator'
  post '/nanobot' => 'generators#create', as: 'generators'

  # oauth
  get 'auth/github/callback' => 'session#github'
  get 'auth/google_oauth2/callback' => 'session#google_oauth2'
  get 'auth/failure' => 'session#failure'
  get 'logout' => 'session#destroy'

  get '/nanobot/:user/:id/visualize' => 'generators#user_visualize'

  get '/nanobot/:id/routing' => 'generators#routing'
  post '/nanobot/:id/visualize' => 'generators#visualize', as: 'generate_routing'
  get '/nanobot/:id/async_visualize' => 'generators#async_visualize', as: 'generate_async_routing'
  get '/nanobot/:id/visualize' => 'generators#visualize'
  get '/nanobot/:id/compile' => 'generators#compile'
  post '/nanobot/:id/compile' => 'generators#signup_and_save'
  get '/contact/new' => 'users#get_contact'
  post '/nanobot/:id/update_generator' => 'generators#update_generator', as: 'update_generator'
  # ajax requests
 
  get '/checkemail' => 'users#check_email', :defaults => { format: :json }
  get '/checkusername' => 'users#check_username', :defaults => { format: :json }

  get '/nanobot/generator' => 'generators#generator', as: 'shape_generator'

  get '/dna28' => 'outreach#dna28'
  get '/404' => 'errors#not_found'
  get '/422' => 'errors#unacceptable'
  get '/500' => 'errors#internal_error'
  match '*path' => "errors#not_found", via: :all
end
