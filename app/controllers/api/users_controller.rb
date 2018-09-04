class Api::UsersController < ApplicationController
  before_action :authenticate_user!

  def update
    user = User.find(params[:id])
    user.name = params[:name]
    user.email = params[:email]
    s3 = Aws::S3::Resource.new(region: ENV['AWS_REGION'])
    s3_bucket = ENV['BUCKET']
    file = params[:file]
    # User.import(params[:file].path)
    begin
      ext = File.extname(file)
      obj = s3.bucket(s3_bucket).object("/#{user.id}#{ext}")
      obj.upload_file(file, acl: 'public-read')
      user.image = obj.public_url
      if user.save
        render json: user
      else
        render json: { errors: user.errors.full_messages }, status: 422
      end
    rescue => e
      render json: { errors: e }, status: 422
    end
  end

end