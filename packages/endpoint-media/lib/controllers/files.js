import HttpError from "http-errors";
import mongodb from "mongodb";

const { ObjectId } = mongodb;

export const filesController = (application, publication) => ({
  /**
   * List previously uploaded files
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

      const page = parseInt(request.query.page) || 1;
      const limit = parseInt(request.query.limit) || 18;
      const skip = (page - 1) * limit;

      const files = await publication.media
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const count = await publication.media.countDocuments();

      // Pagination pages
      const totalPages = Math.ceil(count / limit);
      const nextPage = page < totalPages ? page + 1 : false;
      const previousPage = page > 0 ? page - 1 : false;

      // Pagination items
      const items = [...Array(totalPages).keys()].map((item) => ({
        current: item + 1 === page,
        href: `?page=${item + 1}`,
        text: item + 1,
      }));

      // Pagination results
      const resultsFrom = (page - 1) * limit + 1;
      let resultsTo = resultsFrom - 1 + limit;
      resultsTo = resultsTo > count ? count : resultsTo;

      response.render("files", {
        title: response.__("media.files.title"),
        files,
        items,
        next: {
          href: `?page=${nextPage}`,
        },
        previous: {
          href: `?page=${previousPage}`,
        },
        results: {
          from: resultsFrom,
          to: resultsTo,
          count,
        },
        parentUrl: `${publication.mediaEndpoint}/files/`,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * View previously uploaded files
   *
   * @param {object} request HTTP request
   * @param {object} response HTTP response
   * @param {Function} next Next middleware callback
   * @returns {object} HTTP response
   */
  async view(request, response, next) {
    try {
      const { id } = request.params;
      const file = await publication.media.findOne({ _id: new ObjectId(id) });

      if (!file) {
        throw new HttpError(404, "No file was found with this UUID");
      }

      response.render("file", {
        parent: response.__("media.files.title"),
        file,
      });
    } catch (error) {
      next(error);
    }
  },
});
