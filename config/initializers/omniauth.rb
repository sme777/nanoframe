Rails.application.config.middleware.use OmniAuth::Builder do
    provider :github, Rails.application.credentials[:GITHUB_KEY], Rails.application.credentials[:GITHUB_SECRET]
    unless Rails.env.production?
      OmniAuth.config.test_mode = true
      user = YAML.load(File.read "#{Rails.root}/db/github_mock_login.yml")[Rails.env]
      OmniAuth.config.add_mock(:github,
                               {
                                   :uid => '12345',
                                   :info => {
                                       :name => user['name'],
                                       :nickname => user['github_uid'],
                                       :email => user['email'],
                                       :type_user => user['user_type']
                                   }
                               })
    end
  end