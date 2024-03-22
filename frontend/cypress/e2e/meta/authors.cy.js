import { authors, group } from "../../../meta/authors";

describe("Meta", () => {
  it("Remplisser les infos de votre groupe dans frontend/meta/authors.js", () => {
    expect(authors).to.not.deep.eq([
      "Natalia Surdu (p2312523)",
      "Lyam Keovilay (p2203293)",
    ]);

    expect(group).to.oneOf([1, 2, 3]);
  });
});
