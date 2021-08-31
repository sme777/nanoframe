Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/' => 'users#index'
  post '/' => 'users#create'
  get '/profile' => 'users#profile'
  get '/signin' => 'users#sign_in' 
  get '/signout' => 'users#sign_out'
  get '/contact' => 'users#contact'
  get '/about' => 'users#about'
  get 'shaper' => 'generators#shaper'
  get '/nanobot' => 'generators#index'
  post '/nanobot' => 'generators#create', as: 'generator'
  post '/nanobot' => 'generators#create', as: 'generators'
  get '/nanobot/:id' => 'generators#synthesize'
  get '/nanobot/routing/:id' => 'generators#routing'
  get '/nanobot/results/:id' => 'generators#results'
  get '/contact/new' => 'users#get_contact'
  #get '/nanobot/new' => 'generators#new'
  get '/checkemail' => 'users#check_email', :defaults => { :format => :json }
  get '/checkusername' => 'users#check_username', :defaults => { :format => :json }

  #downloading files
  get '/nanobot/:id/pdb' => 'generators#download_pdb'
  get '/nanobot/:id/oxdna' => 'generators#download_oxdna'
  get '/nanobot/:id/csv' => 'generators#download_csv'
  get '/nanobot/:id/fasta' => 'generators#download_fasta'
  #resources :generators 
end
