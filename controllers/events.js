const { response } = require("express");
const Event = require("../models/Event");
const getEventos = async (req, res = response) => {
  const eventos = await Event.find().populate("user", "name");

  return res.json({
    ok: true,
    eventos: eventos,
  });
};
const crearEvento = async (req, res = response) => {
  const evento = new Event(req.body);

  try {
    evento.user = req.uid;

    const eventoGuardado = await evento.save();

    res.json({
      ok: true,
      evento: eventoGuardado,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: "false",
      msg: "Comuniquese con el administrador",
    });
  }
};
const actualizarEvento = async (req, res = response) => {
  const eventId = req.params.id;
  try {
    const evento = await Event.findById(eventId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe por ese id",
      });
    }

    if (evento.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de editar este evento",
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: req.uid,
    };

    const eventoActualizado = await Event.findByIdAndUpdate(
      eventId,
      nuevoEvento,
      { new: true }
    );

    res.json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Comuniquese con el administrador",
    });
  }
};
const eliminarEvento = async (req, res = response) => {
  const eventId = req.params.id;
  try {
    const evento = await Event.findById(eventId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontro evento con ese id",
      });
    }

    if (evento.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio para eliminar el evento",
      });
    }

    const eventoEliminado = await Event.findByIdAndRemove(eventId);

    res.json({
      ok: true,
      evento: eventoEliminado,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Comuniquese con el administrador",
    });
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
