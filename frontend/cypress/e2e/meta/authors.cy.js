import { authors, group } from "../../../meta/authors";

describe("Meta", () => {
  it("Remplisser les infos de votre groupe dans frontend/meta/authors.js", () => {
    expect(authors).to.not.deep.eq([
      "Natalia Surdu (12312523)",
      "Lyam Keovilay (12203293)",
    ]);

    expect(group).to.oneOf([1, 2, 3]);
  });
});
