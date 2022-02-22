# frozen_string_literal: true

Rails.application.routes.draw do
  get 'session/create'
  get 'playground/index'
  resources :routers
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/' => 'users#index', as: :root
  post '/' => 'users#create'
  get '/profile' => 'users#profile'
  get '/signin' => 'users#sign_in'
  get '/signout' => 'users#sign_out'
  get '/miscellaneous' => 'users#miscellaneous'
  get '/nanobot' => 'generators#index'
  get '/playground' => 'playground#index'
  post '/nanobot' => 'generators#create', as: 'generator'
  post '/nanobot' => 'generators#create', as: 'generators'
  get '/nanobot/custom' => 'generators#custom'

  # oauth
  get 'auth/github/callback' => 'session#github'
  get 'auth/google_oauth2/callback' => 'session#google_oauth2'
  get 'auth/failure' => 'session#failure'
  get 'logout' => 'session#destroy'
  # get '/auth/google_oauth2/callback', to: 'users#google_oauth2', as: :google_oauth2_callback
  # get '/auth/github/callback', to: 'users#github', as: :github_callback

  post '/nanobot/:id/routing_position_update' => 'generators#routing_position_update'
  get '/nanobot/:id/synthesize' => 'generators#synthesize'
  post '/nanobot/:id/routing' => 'generators#routing'
  get '/nanobot/:id/routing' => 'generators#routing'
  post '/nanobot/:id/visualize' => 'generators#visualize', as: 'generate_routing'
  get '/nanobot/:id/visualize' => 'generators#visualize'
  get '/nanobot/:id/compile' => 'generators#compile'
  post '/nanobot/:id/compile' => 'generators#signup_and_save'
  get '/contact/new' => 'users#get_contact'

  # ajax requests
  get '/checkemail' => 'users#check_email', :defaults => { format: :json }
  get '/checkusername' => 'users#check_username', :defaults => { format: :json }
  # get '/nanobot/check_shape_params' => 'generators#check_shape_params'
  # downloading files
  post '/nanobot/:id/staples' => 'downloads#download_staples', as: 'download_staples'
  get '/nanobot/:id/nfr' => 'downloads#download_nfr'
  get '/nanobot/:id/pdb' => 'downloads#download_pdb'
  get '/nanobot/:id/oxview' => 'downloads#download_oxview'
  get '/nanobot/:id/txt' => 'downloads#download_txt'
  get '/nanobot/:id/cadnano' => 'downloads#download_cadnano'
  get '/nanobot/:id/csv' => 'downloads#download_csv'
  get '/nanobot/:id/fasta' => 'downloads#download_fasta'
  get '/nanobot/:id/bundle' => 'downloads#download_bundle'
  # resources :generators
  get 'nanobot/generator' => 'generators#generator', as: 'shape_generator'
end
