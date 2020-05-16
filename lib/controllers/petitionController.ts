import * as mongoose from "mongoose";
import { PetitionSchema } from "../models/petitionModel";
import { Request, Response } from "express";
import { Checa } from "../checa/checaProsess";

const Petition = mongoose.model("Petition", PetitionSchema);

interface Opts {
  chromeFlags: string[];
}

interface DataResponse {
  petition: object;
  checaResponse: object;
}

export class PetitionController {
  public addNewPetition(req: Request, res: Response) {
    let url = req.body.url;
    let checaTech: Checa = new Checa(url);

    let opts: Opts = {
      chromeFlags: ["--show-paint-rects"],
    };

    checaTech
      .launchChromeAndRunLighthouse(opts)
      .then((resp) => {
        let saveData = { ...req.body, rawData: JSON.stringify(resp) };

        let newPetition = new Petition(saveData);
        newPetition.save((err, petition) => {
          if (err) {
            res.send(err);
          }
          let dataReturn: DataResponse = {
            petition: petition,
            checaResponse: resp,
          };
          res.json(dataReturn);
        });
      })
      .catch((err) => {
        res.send(err);
      });
  }

  public getPetitions(req: Request, res: Response) {
    Petition.find({}, (err, petition) => {
      if (err) {
        res.send(err);
      }
      res.json(petition);
    });
  }

  public getPetitionWithID(req: Request, res: Response) {
    Petition.findById(req.params.petitionId, (err, petition) => {
      if (err) {
        res.send(err);
      }
      res.json(petition);
    });
  }

  public updatePetition(req: Request, res: Response) {
    Petition.findOneAndUpdate(
      { _id: req.params.petitionId },
      req.body,
      { new: true },
      (err, petition) => {
        if (err) {
          res.send(err);
        }
        res.json(petition);
      }
    );
  }

  public deletePetition(req: Request, res: Response) {
    Petition.remove({ _id: req.params.petitionId }, (err, petition) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Successfully deleted petition!" });
    });
  }
}
