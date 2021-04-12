import {
  Container,
  FormLabel,
  Grid,
  Input,
  withStyles,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Typography,
  Slide,
  IconButton,
} from "@material-ui/core";
import { AddCircle, Cancel, Delete, ExpandMore } from "@material-ui/icons";
import "./Components.css";
import { styles } from "../../assets/styles/Styles";
import ParticipantsRow from "./ParticipantsRow";
import { forwardRef, useState } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProjectParticipants = (props) => {
  const {
    classes,
    listaAdicionados,
    setListaAdicionados,
    setInfoProject,
  } = props;

  const [listaParticipantes, setListaParticipantes] = useState([
    {
      nome: "Denis Lima",
      area: "Dev",
      telefone: "12 123456789",
      email: "denis@bureautech.com",
    },
    {
      nome: "Charles Ferreira",
      area: "PO",
      telefone: "12 123456439",
      email: "charles@bureautech.com",
    },
    {
      nome: "Bia Coutinho",
      area: "Dev",
      telefone: "12 1267796789",
      email: "bia@bureautech.com",
    },
  ]);

  const [atual, setAtual] = useState({
    nome: "",
    email: "",
    telefone: "",
    area: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [checkeds, setCheckeds] = useState([]);

  // Verifica se o participante já existe na lista de adicionados
  const existeParticipante = (novo) => {
    let existe = false;

    for (let i = 0; i < listaAdicionados.length; i++) {
      const each = listaAdicionados[i];
      if (each.nome === novo.nome && each.email === novo.email) {
        existe = true;
        break;
      }
    }

    return existe;
  };

  // Rastreia o participante atualmente escolhido
  const pegarParticipante = (participante) => {
    setAtual(
      participante
        ? participante
        : {
            nome: "",
            email: "",
            telefone: "",
            area: "",
          }
    );
  };

  // Adicionar o participante escolhido na lista, limpar os inputs ao adicionar
  const adicionarParticipante = (novo) => {
    const existe = existeParticipante(novo);
    // Verifica se não é um objeto vazio
    const temNome = Object.values(novo)[0].length;
    if (!existe && temNome) {
      setAtual({
        nome: "",
        email: "",
        telefone: "",
        area: "",
      });
      setListaAdicionados([...listaAdicionados, novo]);
      setInfoProject([...listaAdicionados, novo]);

      // Limpa o campo "Participante"
      document.querySelector(".MuiAutocomplete-clearIndicator").click();
    }
  };

  // Alterna entre os estados "Open" e "Close" da lista
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // Pega o value dos checkbox marcados e coloca em ordem decrescente
  const pegarCheckbox = (value) => {
    if (!checkeds.includes(value)) {
      const novoArray = [...checkeds, value].sort((a, b) => {
        return b - a;
      });
      setCheckeds(novoArray);
    } else {
      const novoArray = checkeds
        .filter((num) => num !== value)
        .sort((a, b) => {
          return b - a;
        });
      setCheckeds(novoArray);
    }
  };

  const handleDelete = () => {
    if (checkeds.length) {
      let newArray = [...listaAdicionados];
      checkeds.forEach((value) => {
        newArray.splice(value, 1);
      });
      setListaAdicionados(newArray);
      setInfoProject(newArray);
      document
        .querySelectorAll('input[type="checkbox"]')
        .forEach((checkbox) => {
          if (checkbox.checked) {
            checkbox.click();
          }
        });
      setCheckeds([]);
    }
  };

  return (
    <Container>
      <Grid
        container
        className={classes.grid}
        style={{ paddingBottom: 0, paddingRight: 0 }}
      >
        <Grid item xs={12}>
          <Grid
            container
            justify="flex-start"
            alignItems="center"
            style={{ marginBottom: 30, paddingTop: 20 }}
          >
            <FormLabel
              className={classes.normalText}
              style={{ marginRight: 15 }}
            >
              Projeto
            </FormLabel>
            <Grid item xs={12} sm={5} md={4}>
              <Input className={classes.textField} disableUnderline />
            </Grid>
          </Grid>
          <ParticipantsRow
            adicionarParticipante={adicionarParticipante}
            listaParticipantes={listaParticipantes}
            setListaParticipantes={setListaParticipantes}
            pegarParticipante={pegarParticipante}
            atual={atual}
          />
        </Grid>
        <Grid
          container
          justify="flex-end"
          alignItems="center"
          style={{ paddingTop: 10 }}
        >
          <Grid item xs={7}>
            <Grid container justify="flex-end">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClick}
              >
                Lista de participantes
              </Button>
              <Dialog
                open={isOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClick}
              >
                <DialogTitle>Lista de participantes</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {listaAdicionados.length !== 0 &&
                      listaAdicionados.map((dados, index) => {
                        return (
                          <Accordion key={index}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={(e) =>
                                      pegarCheckbox(e.target.value)
                                    }
                                    value={index}
                                  />
                                }
                                label={dados.nome}
                                onClick={(event) => event.stopPropagation()}
                                onFocus={(event) => event.stopPropagation()}
                              />
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid
                                container
                                justify="space-between"
                                className="light"
                              >
                                <Grid item>
                                  <Typography style={{ padding: 10 }}>
                                    {dados.area}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography style={{ padding: 10 }}>
                                    {dados.telefone}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography style={{ padding: 10 }}>
                                    {dados.email}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}
                  </DialogContentText>
                </DialogContent>
                <Grid container justify="flex-end">
                  <Grid item>
                    <DialogActions>
                      <Button
                        onClick={handleDelete}
                        color="secondary"
                        variant="contained"
                      >
                        <Delete />
                        Remover
                      </Button>
                    </DialogActions>
                  </Grid>
                  <Grid item>
                    <DialogActions>
                      <Button
                        onClick={handleClick}
                        color="secondary"
                        variant="contained"
                      >
                        <Cancel />
                        Fechar
                      </Button>
                    </DialogActions>
                  </Grid>
                </Grid>
              </Dialog>
            </Grid>
          </Grid>
          <Grid item xs>
            <Grid
              container
              justify="flex-end"
              alignItems="flex-end"
              style={{ height: "100%" }}
            >
              <IconButton
                className="no-margin"
                onClick={() => adicionarParticipante(atual)}
              >
                <AddCircle
                  className="largeIcon"
                  style={{ color: "white" }}
                ></AddCircle>
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default withStyles(styles, { withTheme: true })(ProjectParticipants);
