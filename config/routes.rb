Rails.application.routes.draw do
  resources :routers
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/' => 'users#index'
  post '/' => 'users#create'
  get '/profile' => 'users#profile'
  get '/signin' => 'users#sign_in'
  get '/signout' => 'users#sign_out'
  get '/miscellaneous' => 'users#miscellaneous'
  get 'shaper' => 'generators#shaper'
  get '/nanobot' => 'generators#index'
  post '/nanobot' => 'generators#create', as: 'generator'
  post '/nanobot' => 'generators#create', as: 'generators'

  get '/nanobot/:id/synthesize' => 'generators#synthesize'
  get '/nanobot/:id/routing' => 'generators#routing'
  get '/nanobot/:id/visualize' => 'generators#visualize'
  get '/nanobot/:id/compile' => 'generators#compile'
  post '/nanobot/:id/compile' => 'generators#signup_and_save'
  get '/contact/new' => 'users#get_contact'
  get '/checkemail' => 'users#check_email', :defaults => { format: :json }
  get '/checkusername' => 'users#check_username', :defaults => { format: :json }

  # downloading files
  get '/nanobot/:id/pdb' => 'generators#download_pdb'
  get '/nanobot/:id/oxdna' => 'generators#download_oxdna'
  get '/nanobot/:id/txt' => 'generators#download_txt'
  get '/nanobot/:id/cadnano' => 'generators#download_cadnano'
  get '/nanobot/:id/csv' => 'generators#download_csv'
  get '/nanobot/:id/fasta' => 'generators#download_fasta'
  get '/nanobot/:id/bundle' => 'generators#download_bundle'
  # resources :generators
  get 'nanobot/generator' => 'generators#generator', as: "shape_generator"
end
