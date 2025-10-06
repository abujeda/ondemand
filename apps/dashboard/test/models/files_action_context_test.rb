require 'test_helper'

class FilesActionContextTest < ActiveSupport::TestCase
  def test_disabled_when_label_or_endpoint_missing
    context = FilesActionContext.new(config: {}, action_id: 'action-123')

    assert_not context.enabled?
    assert_nil context.label
    assert_nil context.endpoint
    assert_equal 'action-123', context.action_id
  end

  def test_enabled_when_label_and_endpoint_present
    context = FilesActionContext.new(
      config: { label: 'Example', endpoint: 'https://example.org/api' },
      action_id: 'action-123'
    )

    assert context.enabled?
    assert_equal 'Example', context.label
    assert_equal 'https://example.org/api', context.endpoint
    assert_equal 'action-123', context.action_id
  end

  def test_icon_returns_value_from_config
    context = FilesActionContext.new(config: { label: 'Example', endpoint: 'https://example.org/api', icon: 'fas://paper-plane' })

    assert_equal 'fas://paper-plane', context.icon
    assert_equal URI('fas://paper-plane'), context.icon_uri
  end

  def test_icon_uri_returns_nil_when_invalid
    context = FilesActionContext.new(config: { label: 'Example', endpoint: 'https://example.org/api', icon: '://invalid' })

    assert_nil context.icon_uri
  end

  def test_icon_uri_returns_nil_when_blank
    context = FilesActionContext.new(config: { label: 'Example', endpoint: 'https://example.org/api', icon: '' })

    assert_nil context.icon_uri
  end
end
