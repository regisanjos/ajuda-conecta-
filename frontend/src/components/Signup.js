// SignUpForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword } from '../scripts/firebase';
import { updateProfile } from 'firebase/auth';
import styles from '../styles/Login.module.css';

function Signup({ onSignupSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleCpfChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
                         .replace(/(\d{3})(\d)/, '$1.$2')
                         .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            setCpf(value);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name,
            });

            setSuccessMessage('Cadastro realizado com sucesso!');
            onSignupSuccess();
        } catch (error) {
            setError('Erro ao cadastrar: ' + error.message);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.cadastroTitle}>Cadastrando</h2>
            <p className={styles.cadastroP}>Preencha seus dados pessoais para criar uma conta</p>
            <form className={styles.cadastroForm} onSubmit={handleSignup}>
                <label className={styles.label1} for='name'>Nome</label>
                <input 
                    type="text" 
                    placeholder="Nome" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                    className={styles.inputName} 
                />
                                     <label className={styles.label4} for='cpf'>CNPJ</label>
                    <input 
                        type="text" 
                        placeholder="CNPJ" 
                        value={cpf}
                        onChange={handleCpfChange}
                        required 
                        className={styles.cpfInput} 
                        maxLength="14"
                    />
                <div className={styles.doubleInput}>
                    <label className={styles.label2} for='email'>E-mail</label>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        className={styles.inputEmail} 
                    />
                    <label className={styles.label3} for='password'>Senha</label>
                    <input 
                        type="password" 
                        placeholder="Senha" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        className={styles.inputPassword} 
                    />
                </div>
                
                <div className={styles.doubleInput}>
                    <label className={styles.label7} for='text'>Longradouro</label>
                    <input 
                        type="text" 
                        placeholder="Longradouro" 
                        required 
                        className={styles.inputLong} 
                    />
                    <label className={styles.label8} for='text-2'>Número</label>
                    <input 
                        type="text" 
                        placeholder="Número" 
                        required 
                        className={styles.inputNumber} 
                    />
                </div>
                
                <div className={styles.doubleInput}>
                    <label className={styles.label9} for='cidade'>Cidade</label>
                    <input 
                        type="text" 
                        placeholder="Cidade" 
                        required 
                        className={styles.inputCity} 
                    />
                    <label className={styles.label10}>Estado</label>
                    <select required className={styles.inputState}>
                    <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                    </select>
                </div>

                {error && <p className={styles.error}>{error}</p>}
                {successMessage && <p className={styles.success}>{successMessage}</p>}

                <button type="submit" className={styles.submitBtn}>CADASTRAR</button>
            </form>
        </div>
    );
}

export default Signup;
