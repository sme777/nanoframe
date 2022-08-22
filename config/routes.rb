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
  get '/guides' => redirect("/guides/home")
  get '/synthesizer' => redirect("/synthesizer/1")
  get '/playground' => 'playground#index'

  # oauth
  get 'auth/github/callback' => 'session#github'
  get 'auth/google_oauth2/callback' => 'session#google_oauth2'
  get 'auth/failure' => 'session#failure'
  get 'logout' => 'session#destroy'

  # synthesizer
  get '/synthesizer/new' => 'generators#new'
  post '/synthesizer/new' => 'generators#create'
  get '/synthesizer/generator' => 'generators#generator', as: 'shape_generator'
  get '/synthesizer/:page' => 'generators#synthesizer'
  get '/synthesizer/:user/:id/visualize' => 'generators#user_visualize'
  post '/synthesizer/:id/visualize' => 'generators#visualize', as: 'generate_routing'
  get '/synthesizer/:id/async_visualize' => 'generators#async_visualize', as: 'generate_async_routing'
  get '/synthesizer/:id/visualize' => 'generators#visualize'
  post '/synthesizer/:id/update_generator' => 'generators#update_generator', as: 'update_generator'

  get '/contact/new' => 'users#get_contact' 
  get '/checkemail' => 'users#check_email', :defaults => { format: :json }
  get '/checkusername' => 'users#check_username', :defaults => { format: :json }
  
  #guides
  get '/guides/home' => 'guides#home'
  get '/guides/feed' => 'guides#feed'
  get '/guides/shapes' => 'guides#shapes'
  get '/guides/scaffolds' => 'guides#scaffolds'
  get '/guides/wireframe' => 'guides#wireframe'
  get '/guides/dimensions' => 'guides#dimensions'
  get '/guides/advanced' => 'guides#advanced'
  get '/guides/canvas_gui' => 'guides#canvas_gui'
  get '/guides/canvas_api' => 'guides#canvas_api'
  get '/guides/nfr_projects' => 'guides#nfr_projects'
  get '/guides/tpsc' => 'guides#tpsc'
  get '/guides/api_keys' => 'guides#api_keys'
  get '/guides/home_api' => 'guides#home_api'
  get '/guides/feed_api' => 'guides#feed_api'
  get '/guides/synthesizer_api' => 'guides#synthesizer_api'
  get '/guides/playground_api' => 'guides#playground_api'
  get '/guides/single_origami_assembly' => 'guides#single_origami_assembly'
  get '/guides/single_origami_cage_opening' => 'guides#single_origami_cage_opening'
  get '/guides/multi_origami_assembly' => 'guides#multi_origami_assembly'
  get '/guides/multi_origami_cage_opening' => 'guides#multi_origami_cage_opening'

  # outreach
  get '/dna28' => 'outreach#DNA28'
  
  # errors
  get '/404' => 'errors#not_found'
  get '/422' => 'errors#unacceptable'
  get '/500' => 'errors#internal_error'
  match '*path' => "errors#not_found", via: :all
end
