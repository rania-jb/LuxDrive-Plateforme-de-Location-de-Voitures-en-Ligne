require('dotenv').config();  

const dns = require("dns"); 
dns.setServers(["1.1.1.1", "8.8.8.8"]); 

const express = require("express"); 
const connectDb = require("./config/ConnectDb"); 
const cors = require("cors"); // permet de gérer les requêtes cross-origin


const app = express(); 
app.use(cors());
app.use(express.json()); // permet de parser le corps des requêtes en JSON

const port = 5000;
connectDb(); 

app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api', require('./routes/authRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));


const cron = require('node-cron'); // Permet d'exécuter des tâches planifiées
const Reservation = require('./Models/Reservation');
const Car = require('./Models/Car');


const runCron = async () => {
  const now = new Date();

  
  const starting = await Reservation.find({ // Trouve les réservations qui commencent maintenant ou avant et qui sont toujours confirmées
    status:    'confirmed',
    startDate: { $lte: now },
    endDate:   { $gte: now },
  });

  for (const res of starting) {// Pour chaque réservation qui commence, on rend la voiture indisponible
    await Car.findByIdAndUpdate(res.car, { isAvailable: false });
  }
// Trouve les réservations qui ont expiré et qui sont toujours confirmées
  const expired = await Reservation.find({  
    status:  'confirmed',
    endDate: { $lt: now },
  });

 // Pour chaque réservation expirée, on vérifie s'il y a une autre réservation active pour la même voiture
  for (const res of expired) {
    const nextActive = await Reservation.findOne({
      car:    res.car,
      status: 'confirmed',
      startDate: { $lte: now },
      endDate:   { $gte: now },
      _id:    { $ne: res._id }, // Exclut la réservation actuelle
    });

    if (!nextActive) {// Si aucune réservation active n'est trouvée, on rend la voiture disponible
      await Car.findByIdAndUpdate(res.car, { isAvailable: true });
    }
    res.status = 'completed';
    await res.save();
  }

  console.log(`Cron init: ${starting.length} unavailable, ${expired.length} completed`);
};

runCron(); 

cron.schedule('*/30 * * * *', runCron);

app.listen(port, (err) => { 
  if (err) throw err;
  console.log(`Server running on Port ${port} http://localhost:${port}`);
});