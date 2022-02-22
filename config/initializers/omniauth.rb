# frozen_string_literal: true

def setup_omniauth_mocks
    OmniAuth.config.test_mode = true
    OmniAuth.config.add_mock(
        :google_oauth2,
        omniauth_google_mock
    )
    OmniAuth.config.add_mock(
        :github,
        omniauth_github_mock
    )
end

def omniauth_google_mock
    user = YAML.safe_load(File.read("#{Rails.root}/db/google_mock_login.yml"))[Rails.env]
    {
        uid: '54321',
        info: {
          name: user['name'],
          email: user['email']
        }
      }
end

def omniauth_github_mock
    user = YAML.safe_load(File.read("#{Rails.root}/db/github_mock_login.yml"))[Rails.env]
    {
        uid: '12345',
        info: {
          name: user['name'],
          nickname: user['github_uid'],
          email: user['email'],
          type_user: user['user_type']
        }
      }
end

Rails.application.config.middleware.use OmniAuth::Builder do
    setup_omniauth_mocks unless Rails.env.production?
    provider :github, Rails.application.credentials[:GITHUB_KEY], Rails.application.credentials[:GITHUB_SECRET]
    provider :google_oauth2, Rails.application.credentials[:GOOGLE_CLIENT_ID], Rails.application.credentials[:GOOGLE_CLIENT_SECRET]
end
