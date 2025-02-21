# Constrói a imagem Docker
```docker build -t ericquadros/fullcycle .```

# Executa o container para testar
```docker run --rm ericquadros/fullcycle```

# Subindo para o docker hub
```docker tag ericquadros/fullcycle ericquadros/fullcycle```

```docker tag ericquadros/fullcycle ericquadros/fullcycle:latest```

```docker push ericquadros/fullcycle```