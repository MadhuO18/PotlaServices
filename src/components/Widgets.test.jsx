// Runtime validation coverage for the Blog stories and photo gallery.
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { InsightsStories } from './Widgets.jsx'

describe('InsightsStories', () => {
  it('shows only the three selected stories in order', () => {
    const markup = renderToStaticMarkup(<InsightsStories />)
    const storyCount = (markup.match(/class="insight-card"/g) || []).length

    expect(storyCount).toBe(3)
    expect(markup.indexOf('Bheeshma Puraskar')).toBeLessThan(
      markup.indexOf('Telugu Web Media: connecting with our community'),
    )
    expect(markup.indexOf('Telugu Web Media: connecting with our community')).toBeLessThan(
      markup.indexOf('A Musical Tribute to S. P. Balasubrahmanyam &amp; S. Janaki'),
    )
  })

  it('renders all six captioned Potla Group moments', () => {
    const markup = renderToStaticMarkup(<InsightsStories />)
    const momentCount = (markup.match(/class="insights-moment(?: insights-moment--founder)?"/g) || []).length
    const images = [
      'potla-group-moments-team-event.jpg',
      'potla-group-moments-women-team.jpg',
      'potla-group-moments-team-activity.jpg',
      'potla-group-moments-celebration.jpg',
      'potla-group-moments-team-selfie.jpg',
      'potla-group-moments-founder.jpg',
    ]

    expect(markup).toContain('Potla Group Moments')
    expect(momentCount).toBe(6)
    for (const image of images) {
      expect(markup).toContain(image)
    }
  })
})
