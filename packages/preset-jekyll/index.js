import YAML from 'yaml';

export const JekyllPreset = class {
  constructor() {
    this.id = 'jekyll';
    this.name = 'Jekyll';
  }

  /**
   * Publication config
   *
   * @returns {object} Publication config
   */
  get config() {
    return {
      categories: [],
      'post-types': [{
        type: 'article',
        name: 'Article',
        post: {
          path: '_posts/{yyyy}-{MM}-{dd}-{slug}.md',
          url: '{yyyy}/{MM}/{dd}/{slug}'
        },
        media: {
          path: 'media/{yyyy}/{MM}/{dd}/{filename}'
        }
      }, {
        type: 'note',
        name: 'Note',
        post: {
          path: '_notes/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'notes/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'photo',
        name: 'Photo',
        post: {
          path: '_photos/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'photos/{yyyy}/{MM}/{dd}/{slug}'
        },
        media: {
          path: 'media/photos/{yyyy}/{MM}/{dd}/{filename}'
        }
      }, {
        type: 'video',
        name: 'Video',
        post: {
          path: '_videos/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'videos/{yyyy}/{MM}/{dd}/{slug}'
        },
        media: {
          path: 'media/videos/{yyyy}/{MM}/{dd}/{filename}'
        }
      }, {
        type: 'audio',
        name: 'Audio',
        post: {
          path: '_audio/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'audio/{yyyy}/{MM}/{dd}/{slug}'
        },
        media: {
          path: 'media/audio/{yyyy}/{MM}/{dd}/{filename}'
        }
      }, {
        type: 'bookmark',
        name: 'Bookmark',
        post: {
          path: '_bookmarks/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'bookmarks/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'checkin',
        name: 'Checkin',
        post: {
          path: '_checkins/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'checkins/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'event',
        name: 'Event',
        post: {
          path: '_events/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'events/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'rsvp',
        name: 'Reply with RSVP',
        post: {
          path: '_replies/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'replies/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'reply',
        name: 'Reply',
        post: {
          path: '_replies/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'replies/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'repost',
        name: 'Repost',
        post: {
          path: '_reposts/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'reposts/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'like',
        name: 'Like',
        post: {
          path: '_likes/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'likes/{yyyy}/{MM}/{dd}/{slug}'
        }
      }],
      'slug-separator': '-',
      'syndicate-to': []
    };
  }

  /**
   * Render post template
   *
   * @param {object} properties Post data variables
   * @returns {string} Rendered template
   */
  postTemplate(properties) {
    const content = properties.content ?
      `${properties.content.html}\n` ||
      `${properties.content.text}\n` |
      `${properties.content}\n` :
      '';

    properties = {
      date: properties.published,
      ...(properties.name && {title: properties.name}),
      ...(properties.summary && {excerpt: properties.summary}),
      ...(properties.category && {category: properties.category}),
      ...(properties.start && {start: properties.start}),
      ...(properties.end && {end: properties.end}),
      ...(properties.rsvp && {rsvp: properties.rsvp}),
      ...(properties.location && {location: properties.location}),
      ...(properties.checkin && {checkin: properties.checkin}),
      ...(properties.audio && {audio: properties.audio}),
      ...(properties.photo && {photo: properties.photo}),
      ...(properties.video && {video: properties.video}),
      ...(properties['bookmark-of'] && {'bookmark-of': properties['bookmark-of']}),
      ...(properties['like-of'] && {'bookmark-of': properties['like-of']}),
      ...(properties['repost-of'] && {'repost-of': properties['repost-of']}),
      ...(properties['in-reply-to'] && {'in-reply-to': properties['in-reply-to']}),
      ...(properties['syndicate-to'] && {'syndicate-to': properties['syndicate-to']})
    };
    let frontmatter = YAML.stringify(properties);
    frontmatter = `---\n${frontmatter}---\n`;

    return frontmatter + content;
  }
};