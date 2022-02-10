import HttpError from "http-errors";
import mongodb from "mongodb";

const { ObjectId } = mongodb;

export const postsController = (application, publication) => ({
  /**
   * List previously published posts
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Callback
   * @returns {object} HTTP response
   */
  async list(request, response, next) {
    try {
      if (!application.hasDatabase) {
        throw new Error(response.__("errors.noDatabase.content"));
      }

      response.render("posts", {
        title: response.__("micropub.posts.title"),
        posts: await publication.posts.find().toArray(),
        parentUrl: `${publication.micropubEndpoint}/posts/`,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * View previously published post
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  async view(request, response, next) {
    try {
      const { id } = request.params;
      const post = await publication.posts.findOne({ _id: new ObjectId(id) });

      if (!post) {
        throw new HttpError(404, "No post was found with this UUID");
      }

      response.render("post", {
        parent: response.__("micropub.posts.title"),
        post,
      });
    } catch (error) {
      next(error);
    }
  },
});
