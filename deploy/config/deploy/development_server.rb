set :stage, :development_server
set :branch, "main"
set :deploy_to, "/srv/school_enrollment_frontend"

server "localhost",
user: "school_enrollment_frontend",
roles: %w{app},
ssh_options: {
  user: "school_enrollment_frontend",
  keys: %w(/tmp/id),
  forward_agent: false,
  auth_methods: %w(publickey),
  port: 22
}
