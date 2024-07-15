/* eslint-disable max-len */
import {onRequest} from "firebase-functions/v2/https";
import axios from "axios";

export const getPlaceDetails = onRequest({cors: true}, async (req, res) => {
  const placeId = "ChIJfWqBMMGVpkARCXTa2ufVueo";
  const apiKey = req.body.data.apiKey; /* "AIzaSyCoTB-Old6kCKAHQnnjHqMm6cPnqXRJ7fw"; */
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=bg`
    );
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send({error: "Error fetching place details"});
  }
});
