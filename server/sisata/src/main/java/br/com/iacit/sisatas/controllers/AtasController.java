package br.com.iacit.sisatas.controllers;

import java.io.IOException;
import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.CrossOrigin;

import br.com.iacit.sisatas.mapper.AtasMapper;
import br.com.iacit.sisatas.models.AtasHeaderControllerModel;
import br.com.iacit.sisatas.models.AtasModel;
import br.com.iacit.sisatas.models.AtasPautaControllerModel;
import br.com.iacit.sisatas.models.AtasProjectControllerModel;
import br.com.iacit.sisatas.models.AtasTopicsControllerModel;
import br.com.iacit.sisatas.projections.AtasProjectionId;
import br.com.iacit.sisatas.repository.AtasRepository;
import br.com.iacit.sisatas.conversor.Conversor;

@CrossOrigin
@Controller
@RequestMapping("/atas")
public class AtasController {

		@Autowired
		private AtasRepository ap;
		
		/**
		 * @Author Daniel Oliveira
		 *
		 * Retorna o ataId da última Ata.
		 *
		 */		
		@ResponseBody
		@RequestMapping(value = "/ultimoRegistro", method = RequestMethod.GET)
		public AtasProjectionId ultimoRegistro() {
			return ap.findTopByOrderByAtaIdDesc();
		}
		
		
		/**
		 * @Author Daniel Oliveira
		 *
		 * Cadastr
		 *
		 */	
		@ResponseBody
		@RequestMapping(value = "/cadastrarAtas", method = RequestMethod.POST, consumes = "application/json")
		public ResponseEntity<String> cadastrarAtas(@RequestBody AtasHeaderControllerModel ataHeader, 
									@RequestBody AtasProjectControllerModel ataProject,
									@RequestBody AtasPautaControllerModel ataPauta,
									@RequestBody AtasTopicsControllerModel ataTopics) throws IOException {
			try {
				ap.save(AtasMapper.converter(ataHeader, ataProject, ataPauta, ataTopics));
			} catch (DataAccessException e) {
				e.printStackTrace();
				return ResponseEntity.badRequest().body(e.getMessage());
			}
			return ResponseEntity.ok().build();
		}


		@ResponseBody
        @RequestMapping(value = "/cadastrarAta", method = RequestMethod.POST, consumes = "application/json")
        public ResponseEntity<String> cadastrarAtas(@RequestBody AtasModel ata) throws IOException {
					String ultimoId = ap.findTopByOrderByAtaIdDesc().getAtaId();

					Conversor conversor = new Conversor();
					String novoId = conversor.calcularId(ultimoId);
					ata.setAtaId(novoId);
					
					try {
							ap.save(ata);
					} catch (DataAccessException e) {
							e.printStackTrace();
							return ResponseEntity.badRequest().body(e.getMessage());
					}
					return ResponseEntity.ok().build();
        }
		
		@ResponseBody
		@RequestMapping(value = "/atualizarAtas", method = RequestMethod.GET)
		public void atualizarAtas() {
			// Desenvolver
		}

		@ResponseBody
		@RequestMapping(value = "/listarAtas", method = RequestMethod.GET)
		public List<AtasModel> listarAtas() {
			List<AtasModel> atas = null;
			try {
				atas = ap.findAll();
			} catch (DataAccessException e) {
				e.printStackTrace();
			}
			return atas;
		}
		
		@ResponseBody
		@RequestMapping(value = "/pegarAta/{ata_id}", method = RequestMethod.GET)
		public ResponseEntity<AtasModel> pegarAta(@PathVariable long ata_id) {
			try {
				if (ap.existsByataId(ata_id)) {
					AtasModel ataSelecionada = ap.findByataId(ata_id);
			        return ResponseEntity.ok(ataSelecionada);
			    }
			} catch (DataAccessException e) {
				e.printStackTrace();
			}
			return ResponseEntity.notFound().build();
		}

		@ResponseBody
		@RequestMapping(value = "/excluirAtas/{ata_id}", method = RequestMethod.DELETE)
		public ResponseEntity<String> excluirAtas(@PathVariable long ata_id) {
			try {
				AtasModel ataSelecionada = ap.findByataId(ata_id);
				if (ap.existsByataId(ata_id)) {
					ap.delete(ataSelecionada);
			        return ResponseEntity.ok().build();
			    }
			} catch (DataAccessException e) {
				e.printStackTrace();
			}
			
			return ResponseEntity.notFound().build();
		}

}
