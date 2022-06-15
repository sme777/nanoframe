# frozen_string_literal: true

require 'aws-sdk-core'

Aws.config.update(
  region: 'us-east-2',
  credentials: Aws::Credentials.new(Rails.application.credentials.config[:AWS_S3_KEY],
                                    Rails.application.credentials.config[:AWS_S3_SECRET_KEY])
)
