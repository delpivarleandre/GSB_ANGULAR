from flask import Flask, jsonify, request, json
from datetime import datetime
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
import pymysql.cursors
import pyodbc
import calendar

app = Flask(__name__)
CORS(app)


app.config['JWT_SECRET_KEY'] = 'secret'
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

id_visiteur = None
# currentMonth = '05'
currentMonth = datetime.now().strftime("%m")
currentDate = datetime.now().strftime("%Y-%m-%d")


def get_mydb():
    mydb = pymysql.connect(
        host="host",
        user="user",
        passwd="psw",
        database="database"
    )
    return mydb


@app.route('/users/register', methods=['POST'])
def register():
    cnxn = get_mydb()
    cur = cnxn.cursor()
    first_name = request.get_json()['first_name']
    last_name = request.get_json()['last_name']
    email = request.get_json()['email']
    password = bcrypt.generate_password_hash(
        request.get_json()['password']).decode('utf-8')
    created = datetime.utcnow()

    cur.execute("INSERT INTO users (first_name, last_name, email, password, created) VALUES ('" +
                str(first_name) + "', '" +
                str(last_name) + "', '" +
                str(email) + "', '" +
                str(password) + "', '" +
                str(created) + "')")
    cnxn.commit()

    result = {
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'password': password,
        'created': created
    }

    return jsonify({'result': result})


@app.route('/users/login', methods=['POST'])
def login():
    cnxn = get_mydb()
    cur = cnxn.cursor()
    email = request.get_json()['email']
    password = request.get_json()['password']
    result = ""

    cur.execute("SELECT * FROM Visiteur where login = '" + email + "'")
    rv = cur.fetchall()
    columnsName = [i[0] for i in cur.description]
    tab = [{nameChamp: resultChamp[i]
            for i, nameChamp in enumerate(columnsName)} for resultChamp in rv]
    print(tab)
    for i in tab:
        id_visiteur = i['id']
        nom_visiteur = i['nom']
        prenom_visiteur = i['prenom']
        login_visiteur = i['login']
        mdp_visiteur = i['mdp']
        adresse_visiteur = i['adresse']
        cp_visiteur = str(i['cp'])
        ville_visiteur = i['ville']
        date_embauche_visiteur = i['dateEmbauche']
        daf = str(i['daf'])

        # pas = i['mdp']
        # mail = i['login']
        # first_name = i['nom']
        # last_name = i['prenom']
    # print(bcrypt.check_password_hash(pas, password))
    # if bcrypt.check_password_hash(pas, password):
    #     access_token = create_access_token(identity = {'first_name': first_name,'last_name': last_name,'email': mail})
    #     result = jsonify({"token":access_token})
    if mdp_visiteur == password:
        access_token = create_access_token(
            identity={
                'id': id_visiteur,
                'nom': nom_visiteur,
                'prenom': prenom_visiteur,
                'login': login_visiteur,
                'mdp': mdp_visiteur,
                'adresse': adresse_visiteur,
                'cp': cp_visiteur,
                'ville': ville_visiteur,
                'dateEmbauche': date_embauche_visiteur,
                'daf': daf})
        print(access_token)
        result = jsonify({"token": access_token})
    else:
        result = jsonify({"error": "Invalid username and password"})

    return result


@app.route('/users/etat', methods=['GET'])
def etat():
    cnxn = get_mydb()
    cur = cnxn.cursor()
    cur.execute("SELECT * FROM Etat")
    rv = cur.fetchall()
    columnsName = [i[0] for i in cur.description]
    cnxn.close()
    tab = [{nameChamp: resultChamp[i]
            for i, nameChamp in enumerate(columnsName)} for resultChamp in rv]
    return jsonify(tab)


@app.route('/users/mode_paiement', methods=['GET'])
def mode_paiement():
    cnxn = get_mydb()
    cur = cnxn.cursor()
    cur.execute("SELECT * FROM ModePaiement")
    rv = cur.fetchall()
    columnsName = [i[0] for i in cur.description]
    cnxn.close()
    tab = [{nameChamp: resultChamp[i]
            for i, nameChamp in enumerate(columnsName)} for resultChamp in rv]
    return jsonify(tab)


@app.route('/users/ligne_frais_forfait', methods=['GET'])
def ligne_frais_forfait():
    id_visiteur = request.args.get('num')

    cnxn = get_mydb()
    cur = cnxn.cursor()

    tab_id_frais = def_id_frais()

    sql_select_ligne_frais_forfait = """select FraisForfait.id as idfrais, FraisForfait.libelle as libelle, 
		LigneFraisForfait.quantite as quantite from LigneFraisForfait inner join FraisForfait 
		on FraisForfait.id = LigneFraisForfait.idFraisForfait
		where LigneFraisForfait.idVisiteur ='{id_visiteur}' and LigneFraisForfait.mois='{mois}' 
		order by LigneFraisForfait.idFraisForfait""".format(id_visiteur=id_visiteur, mois=currentMonth)
    cur.execute(sql_select_ligne_frais_forfait)
    rv = cur.fetchall()
    columnsName = [i[0] for i in cur.description]
    print(len(rv))
    if len(rv) == 0:
        sql_insert_ligne_frais_forfait = """ INSERT INTO FicheFrais(idVisiteur,mois,nbJustificatifs,montantValide,dateModif,idEtat) 
                                       VALUES('{id_visiteur}', '{mois}', 0, 0, now(), 'CR')""".format(id_visiteur=id_visiteur, mois=currentMonth)
        print(sql_insert_ligne_frais_forfait)
        cur.execute(sql_insert_ligne_frais_forfait)
        for un_id_frais in tab_id_frais:

            sql_insert_frais_forfait = """INSERT INTO LigneFraisForfait(idVisiteur,mois,idFraisForfait,quantite) 
                                     VALUES('{id_visiteur}', '{mois}', '{un_id_frais}', 0)""".format(id_visiteur=id_visiteur, mois=currentMonth, un_id_frais=un_id_frais)

            print(sql_insert_frais_forfait)
            cur.execute(sql_insert_frais_forfait)
        cnxn.commit()
        cur.execute(sql_select_ligne_frais_forfait)
        rv = cur.fetchall()

    cnxn.close()
    tab = [{nameChamp: str(resultChamp[i])
            for i, nameChamp in enumerate(columnsName)} for resultChamp in rv]
    return jsonify(tab)


@app.route('/users/update_frais_forfait', methods=['PUT'])
def update_frais_forfait():
    data = request.get_json()
    ligneFrais = data['ligneFrais']
    id_visiteur = data['idVisiteur']
    print(data)
    print(ligneFrais['ETP'])
    print(id_visiteur)
    tab_id_frais = def_id_frais()
    cnxn = get_mydb()
    cur = cnxn.cursor()
    for un_id_frais in tab_id_frais:
        if not(ligneFrais[un_id_frais]) == None:
            print('Its not None')
            cur.execute("""update LigneFraisForfait set LigneFraisForfait.quantite = {quantite}
			where LigneFraisForfait.idVisiteur = '{id_visiteur}' and LigneFraisForfait.mois = '{mois}'
			and LigneFraisForfait.idFraisForfait = '{un_id_frais}'""".format(quantite=ligneFrais[un_id_frais], id_visiteur=id_visiteur, mois=currentMonth, un_id_frais=un_id_frais))
    cnxn.commit()
    return jsonify(1)


@app.route('/users/add_frais_hors_forfait', methods=['POST'])
def add_frais_hors_forfait():
    data = request.get_json()
    ligne_frais_hors_forfait = data['fraisHorsForfait']
    id_visiteur = data['idVisiteur']
    print(data)
    print(ligne_frais_hors_forfait)
    print(id_visiteur)
    cnxn = get_mydb()
    cur = cnxn.cursor()
    cur.execute("""INSERT INTO LigneFraisHorsForfait (idVisiteur,mois,libelle,date,montant,paiement)
                                       VALUES('{id_visiteur}', '{mois}', '{libelle}', '{date_now}', '{montant}', '{paiement}')""".format(date_now=ligne_frais_hors_forfait['date'], montant=ligne_frais_hors_forfait['montant'], id_visiteur=id_visiteur, mois=currentMonth, libelle=ligne_frais_hors_forfait['libelle'], paiement=ligne_frais_hors_forfait['modePaiement']))
    cnxn.commit()
    return jsonify(1)


def def_id_frais():
    cnxn = get_mydb()
    cur = cnxn.cursor()

    tab_id_frais = []

    sql_select_id_frais = """select id from FraisForfait"""

    cur.execute(sql_select_id_frais)
    tab_id_frais_no_str = cur.fetchall()

    for i in tab_id_frais_no_str:

        id_frais_str = str(i)
        id_frais_str = id_frais_str[2:-3]
        tab_id_frais.append(id_frais_str)

    return tab_id_frais


@app.route('/users/ligne_frais_hors_forfait', methods=['GET'])
def ligne_frais_hors_forfait():
    id_visiteur = request.args.get('num')
    cnxn = get_mydb()
    cur = cnxn.cursor()
    tab_id_frais = def_id_frais()
    sql_select_ligne_frais_hors_forfait = """SELECT LigneFraisHorsForfait.id, libelle, date, montant, paiement, modePaiement
                                       FROM LigneFraisHorsForfait
                                       INNER JOIN ModePaiement ON LigneFraisHorsForfait.paiement = ModePaiement.id
                                       WHERE idVisiteur='{id_visiteur}' AND mois='{mois}'""".format(id_visiteur=id_visiteur, mois=currentMonth)
    cur.execute(sql_select_ligne_frais_hors_forfait)
    rv = cur.fetchall()
    columnsName = [i[0] for i in cur.description]
    cnxn.close()
    tab = [{nameChamp: str(resultChamp[i])
            for i, nameChamp in enumerate(columnsName)} for resultChamp in rv]
    return jsonify(tab)

@app.route('/users/ligne_frais_forfait_complet', methods=['GET'])
def ligne_frais_forfait_complet():
    id_visiteur = request.args.get('num')
    mois_select = request.args.get('mois')
    cnxn = get_mydb()
    cur = cnxn.cursor()
    sql_select_ligne_frais_forfait_complet = """SELECT FraisForfait.id, FraisForfait.libelle, LigneFraisForfait.quantite, FraisForfait.montant, quantite * montant as total
                                       FROM LigneFraisForfait 
                                       INNER JOIN FraisForfait ON FraisForfait.id = LigneFraisForfait.idFraisForfait
                                       WHERE LigneFraisForfait.idVisiteur='{id_visiteur}' and LigneFraisForfait.mois='{mois}'
                                       ORDER BY LigneFraisForfait.idFraisForfait""".format(id_visiteur=id_visiteur, mois=mois_select)
    cur.execute(sql_select_ligne_frais_forfait_complet)
    rv = cur.fetchall()
    columnsName = [i[0] for i in cur.description]
    cnxn.close()
    tab = [{nameChamp: str(resultChamp[i])
            for i, nameChamp in enumerate(columnsName)} for resultChamp in rv]
    return jsonify(tab)

@app.route('/users/mois_visiteur', methods=['GET'])
def mois_visiteur():
    id_visiteur = request.args.get('num')
    cnxn = get_mydb()
    cur = cnxn.cursor()
    sql_select_ligne_frais_hors_forfait = """SELECT FicheFrais.mois FROM FicheFrais WHERE FicheFrais.idVisiteur = '{}' ORDER BY mois ASC""".format(id_visiteur)
    cur.execute(sql_select_ligne_frais_hors_forfait)
    rv = cur.fetchall()
    columnsName = [i[0] for i in cur.description]
    cnxn.close()
    tab = [{nameChamp: str(resultChamp[i])
            for i, nameChamp in enumerate(columnsName)} for resultChamp in rv]
    return jsonify(tab)


@app.route('/users/delete_hors_forfait/<id>', methods=['DELETE'])
def delete_hors_forfait(id):
    print(id)
    cnxn = get_mydb()
    mycursor = cnxn.cursor()
    mycursor.execute("DELETE FROM LigneFraisHorsForfait WHERE id =" + id)
    cnxn.commit()
    if mycursor.rowcount > 0:
        result = {'message': 'record delete'}
    else:
        result = {'message': 'not found'}
    mycursor.close()
    cnxn.close()
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
