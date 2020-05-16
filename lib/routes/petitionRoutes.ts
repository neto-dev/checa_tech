import { Request, Response, NextFunction } from "express";
import { PetitionController } from "../controllers/petitionController";

export class Routes {
  public petitionController: PetitionController = new PetitionController();

  public middlewareToken(req: Request, res: Response, next: NextFunction) {
    // middleware
    if (req.header("Authorization") !== "ch3c4t3ch") {
      res.status(401).send("Eh pussy! You shall not pass!");
    } else {
      next();
    }
  }

  public routes(app): void {
    app.route("/").get((req: Request, res: Response) => {
      res.status(200).send({
        welcome: "Checa Tech Api Madafaka!",
      });
    });

    app
      .route("/petition")
      .get(
        (req: Request, res: Response, next: NextFunction) =>
          this.middlewareToken(req, res, next),
        this.petitionController.getPetitions
      )

      // POST
      .post(
        (req: Request, res: Response, next: NextFunction) =>
          this.middlewareToken(req, res, next),
        this.petitionController.addNewPetition
      );

    // Petition detail
    app
      .route("/petition/:petitionId")
      // get specific petition
      .get(
        (req: Request, res: Response, next: NextFunction) =>
          this.middlewareToken(req, res, next),
        this.petitionController.getPetitionWithID
      )
      .put(
        (req: Request, res: Response, next: NextFunction) =>
          this.middlewareToken(req, res, next),
        this.petitionController.updatePetition
      )
      .delete(
        (req: Request, res: Response, next: NextFunction) =>
          this.middlewareToken(req, res, next),
        this.petitionController.deletePetition
      );
  }
}
