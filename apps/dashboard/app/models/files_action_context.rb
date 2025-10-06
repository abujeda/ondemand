# frozen_string_literal: true

require 'uri'

# Represents the resolved configuration for the Files app "Send to" action.
class FilesActionContext
  attr_reader :action_id

  def initialize(config:, action_id: nil)
    @config = config || {}
    @action_id = action_id.presence
  end

  def enabled?
    label.present? && endpoint.present?
  end

  def label
    config[:label]
  end

  def icon
    config[:icon]
  end

  def icon_uri
    value = icon
    return if value.blank?

    return value if value.is_a?(URI)

    URI.parse(value.to_s)
  rescue URI::InvalidURIError
    nil
  end

  def endpoint
    config[:endpoint]
  end

  private

  attr_reader :config
end
